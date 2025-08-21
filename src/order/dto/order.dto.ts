import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty()
  @IsUUID()
  cartId: string;

  @ApiProperty()
  @IsString()
  paymentMethod: string;
}

export class UpdateOrderDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  paymentStatus?: string;
}

export class OrderQueryDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  paymentStatus?: string;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ required: false, default: 20 })
  @IsOptional()
  limit?: number = 20;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  customerId?: string;
}
