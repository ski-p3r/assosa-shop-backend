import { IsEnum, IsNumber, IsOptional, IsDateString } from 'class-validator';

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

export class CreateDiscountDto {
  @IsEnum(DiscountType)
  type: DiscountType;

  @IsNumber()
  value: number;

  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @IsDateString()
  @IsOptional()
  endDate?: Date;
}
