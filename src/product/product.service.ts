import {
  Injectable,
  NotFoundException,
  Logger,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';


import { ProductRepository } from './product.repository';
import { Product } from './product.entity';
import { S3Service } from '../s3/s3.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    private readonly repo: ProductRepository,
    private readonly s3: S3Service,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  async create(dto: CreateProductDto, file?: Express.Multer.File) {
    this.logger.log(`Creating product: ${dto.name}`);
    if (file) {
      try {
        dto.imageUrl = await this.s3.uploadProductImage(file);
      } catch (error) {
        this.logger.error(`Failed to upload image for product ${dto.name}: ${error instanceof Error ? error.message : error}`);
      }
    }

    const product = await this.repo.createProduct(dto);
    this.logger.log(`Product created with ID: ${product.id}`);
    await this.cacheManager.del(`product:${product.id}`);
    return product;
  }

  async findAll(page: number = 1, limit: number = 10) {
    this.logger.log(`Fetching products from DB (page: ${page}, limit: ${limit})`);
    return await this.repo.findAll(page, limit);
  }

  async findOne(id: string) {
    const cacheKey = `product:${id}`;
    const cachedProduct = await this.cacheManager.get<Product>(cacheKey);

    if (cachedProduct) {
      this.logger.debug(`Returning product ${id} from cache`);
      return cachedProduct;
    }

    this.logger.debug(`Fetching product ${id} from DB`);
    const product = await this.repo.findById(id);
    if (!product) {
      this.logger.warn(`Product with ID ${id} not found`);
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.cacheManager.set(cacheKey, product);
    return product;
  }

  async update(
    id: string,
    dto: UpdateProductDto,
    file?: Express.Multer.File,
  ) {
    this.logger.log(`Updating product ${id}`);

    if (file) {
      try {
        dto.imageUrl = await this.s3.uploadProductImage(file);
      } catch (error) {
        this.logger.error(`Failed to upload new image for product ${id}: ${error instanceof Error ? error.message : error}`);
        throw error;
      }
    }

    const updated = await this.repo.updateProduct(id, dto);
    if (!updated) {
      this.logger.warn(`Product with ID ${id} not found for update`);
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    this.logger.log(`Product ${id} updated`);
    await this.cacheManager.del(`product:${id}`);
    return updated;
  }

  async remove(id: string) {
    this.logger.log(`Deleting product ${id}`);
    const ok = await this.repo.deleteById(id);
    if (!ok) {
      this.logger.warn(`Product with ID ${id} not found for deletion`);
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    this.logger.log(`Product ${id} deleted`);
    await this.cacheManager.del(`product:${id}`);

    return { deleted: true };
  }
}

