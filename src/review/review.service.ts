import { Injectable } from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { ReviewDto, UpdateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async createReview(customerId: string, productId: string, dto: ReviewDto) {
    return this.reviewRepository.createReview(customerId, productId, dto);
  }

  async updateReview(id: string, userId: string, dto: UpdateReviewDto) {
    return this.reviewRepository.updateReview(id, userId, dto);
  }

  async findReviewById(id: string) {
    return this.reviewRepository.findReviewById(id);
  }

  async findReviewsByProductId(productId: string) {
    return this.reviewRepository.findReviewsByProductId(productId);
  }

  async deleteReview(id: string, userId: string) {
    return this.reviewRepository.deleteReview(id, userId);
  }
}
