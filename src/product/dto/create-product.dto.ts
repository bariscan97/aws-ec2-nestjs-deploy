import { IsString, IsNumber, IsOptional, IsNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 15', description: 'The name of the product' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'Latest Apple smartphone', description: 'The description of the product', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 999.99, description: 'The price of the product', minimum: 0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({ type: 'string', format: 'binary', description: 'Product image file', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}

