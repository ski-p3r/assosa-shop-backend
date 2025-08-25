import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreatePromotionDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  bannerUrl?: string;
}
// model Promotion {
//     id        String    @id @default(uuid())
//     title     String
//     description String?
//     startDate DateTime? @map("start_date")
//     endDate   DateTime? @map("end_date")
//     bannerUrl String?   @map("banner_url")

//     @@map("promotions")
//   }
