import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductRepository {
  private readonly logger = new Logger(ProductRepository.name);
  private repo: Repository<Product>;

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(Product);
  }

  async createProduct(dto: CreateProductDto): Promise<Product> {
    try {
      const product = this.repo.create({
        name: dto.name,
        description: dto.description ?? null,
        price: dto.price,
        imageUrl: dto.imageUrl ?? null,
      });

      return await this.repo.save(product);
    } catch (error) {
      this.logger.error(`Failed to create product: ${error instanceof Error ? error.message : error}`);
      throw new InternalServerErrorException('Failed to create product');
    }
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Product[]; total: number }> {
    try {
      const [data, total] = await this.repo.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        order: { createdAt: 'DESC' }, // Optional: default sort
      });
      return { data, total };
    } catch (error) {
      this.logger.error(`Failed to fetch products: ${error instanceof Error ? error.message : error}`);
      throw new InternalServerErrorException('Failed to fetch products');
    }
  }

  async findById(id: string): Promise<Product | null> {
    try {
      return await this.repo.findOne({ where: { id } });
    } catch (error) {
      this.logger.error(`Failed to find product with ID ${id}: ${error instanceof Error ? error.message : error}`);
      throw new InternalServerErrorException('Failed to find product');
    }
  }

  async updateProduct(
    id: string,
    dto: UpdateProductDto,
  ): Promise<Product | null> {
    try {
      const product = await this.findById(id);
      if (!product) return null;

      if (dto.name !== undefined) product.name = dto.name;
      if (dto.description !== undefined) product.description = dto.description;
      if (dto.price !== undefined) product.price = dto.price;
      if (dto.imageUrl !== undefined) product.imageUrl = dto.imageUrl;
      product.updatedAt = new Date();

      return await this.repo.save(product);
    } catch (error) {
      this.logger.error(`Failed to update product with ID ${id}: ${error instanceof Error ? error.message : error}`);
      throw new InternalServerErrorException('Failed to update product');
    }
  }

  async deleteById(id: string): Promise<boolean> {
    try {
      const result = await this.repo.delete(id);
      return (result.affected ?? 0) > 0;
    } catch (error) {
      this.logger.error(`Failed to delete product with ID ${id}: ${error instanceof Error ? error.message : error}`);
      throw new InternalServerErrorException('Failed to delete product');
    }
  }
}

