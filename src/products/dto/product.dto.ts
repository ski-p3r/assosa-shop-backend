import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ProductQueryDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ required: false, default: 20 })
  @IsOptional()
  limit?: number = 20;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  minPrice?: number;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  maxPrice?: number;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  minRating?: number;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  maxRating?: number;
}
