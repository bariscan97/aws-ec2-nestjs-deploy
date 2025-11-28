import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
    @ApiProperty({ example: 'iPhone 15', description: 'The name of the product', required: false })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ example: 'Latest Apple smartphone', description: 'The description of the product', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 999.99, description: 'The price of the product', minimum: 0, required: false })
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @IsOptional()
    price?: number;

    @ApiProperty({ type: 'string', format: 'binary', description: 'Product image file', required: false })
    @IsString()
    @IsOptional()
    imageUrl?: string;
}
