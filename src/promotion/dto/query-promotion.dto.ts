import { IsOptional, IsString } from 'class-validator';

export class QueryPromotionDto {
  @IsString()
  @IsOptional()
  search?: string;
}
