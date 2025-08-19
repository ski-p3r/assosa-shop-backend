import { ApiProperty } from '@nestjs/swagger';

export class ProductVariantDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  variantName: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  stockQuantity: number;

  @ApiProperty()
  isAvailable: boolean;

  @ApiProperty({ required: false })
  procurementTime?: string;

  @ApiProperty({ required: false })
  imageUrl?: string;

  @ApiProperty({ required: false })
  product?: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    basePrice: number;
  };

  @ApiProperty({ type: [Object], required: false })
  discounts?: Array<{
    id: string;
    type: string;
    value: number;
    startDate?: Date;
    endDate?: Date;
  }>;
} 