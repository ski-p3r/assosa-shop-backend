import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
  IsUUID,
} from 'class-validator';

export class CreateProductVariantDto {
  @ApiProperty({ description: 'Product ID this variant belongs to' })
  @IsUUID()
  productId: string;

  @ApiProperty({ description: 'Variant name (e.g., Red, Large, 64GB)' })
  @IsString()
  variantName: string;

  @ApiProperty({ description: 'Variant-specific price' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Stock quantity available', default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  stockQuantity?: number;

  @ApiProperty({
    description: 'Whether the variant is available for purchase',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @ApiProperty({
    description: 'Procurement time (e.g., 3 days)',
    required: false,
  })
  @IsString()
  @IsOptional()
  procurementTime?: string;

  @ApiProperty({ description: 'Variant-specific image URL', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}
