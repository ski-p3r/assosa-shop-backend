import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsString, Max, Min } from 'class-validator';

export class ReviewDto {
  @ApiProperty()
  @IsString()
  reviewText: string;

  @ApiProperty({ minimum: 0, maximum: 5 })
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;
}

export class UpdateReviewDto extends PartialType(ReviewDto) {}
