import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreatePromotionDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @IsDateString()
  @IsOptional()
  endDate?: Date;

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
