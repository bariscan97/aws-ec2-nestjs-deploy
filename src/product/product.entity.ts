import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export class ColumnNumericTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): number {
    return parseFloat(data);
  }
}

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The unique identifier of the product' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ example: 'iPhone 15', description: 'The name of the product' })
  @Column({ length: 255 })
  name!: string;

  @ApiProperty({ example: 'Latest Apple smartphone', description: 'The description of the product', required: false })
  @Column({ type: 'text', nullable: true })
  description: string | null = null;

  @ApiProperty({ example: 999.99, description: 'The price of the product' })
  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  price!: number;

  @ApiProperty({ example: 'https://example.com/image.jpg', description: 'The URL of the product image', required: false })
  @Column({ name: 'image_url', type: 'text', nullable: true })
  imageUrl: string | null = null;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Creation timestamp' })
  @Column({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  createdAt!: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Last update timestamp' })
  @Column({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  updatedAt!: Date;
}

