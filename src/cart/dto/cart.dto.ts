import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID, IsOptional } from 'class-validator';

export class CartCreateDto {}

export class CartQueryDto {
  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiProperty({ required: false, default: 20 })
  @IsOptional()
  @IsNumber()
  limit?: number = 20;
}

export class CartItemDto {
  @ApiProperty()
  @IsUUID()
  productId: string;

  @ApiProperty()
  @IsUUID()
  variantId: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;
}

export class UpdateCartItemDto {
  @ApiProperty()
  @IsNumber()
  quantity: number;
}
