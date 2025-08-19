import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, IsBoolean } from 'class-validator';

export class ProductVariantQueryDto {
  @ApiProperty({ required: false, description: 'Search in variant name' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ required: false, description: 'Filter by product ID' })
  @IsUUID()
  @IsOptional()
  productId?: string;

  @ApiProperty({ required: false, description: 'Filter by availability' })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @ApiProperty({ required: false, description: 'Filter by stock availability' })
  @IsOptional()
  inStock?: boolean;
} 