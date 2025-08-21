import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class InitializePaymentDto {
  @ApiProperty()
  @IsUUID()
  orderId: string;
}

export class UpdatePaymentStatusDto {
  @ApiProperty()
  @IsString()
  paymentStatus: string;
}

export class InvoiceQueryDto {
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
}
