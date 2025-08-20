import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CartCreateDto {}

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
