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
  @ApiProperty()
  @IsString()
  @IsOptional()
  paymentStatus?: string;
}
