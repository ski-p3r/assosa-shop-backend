import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ReviewRepository } from './review.repository';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepository, JwtService],
})
export class ReviewModule {}
