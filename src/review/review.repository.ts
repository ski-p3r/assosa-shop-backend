import { PrismaService } from '@/prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ReviewDto, UpdateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async canIReviewProduct(
    customerId: string,
    productId: string,
  ): Promise<boolean> {
    const order = await this.prisma.order.findFirst({
      where: {
        customerId,
        orderItems: {
          some: {
            productId,
          },
        },
      },
    });

    if (order) {
      return true;
    }
    throw new ForbiddenException(
      'You can only review products you have purchased.',
    );
  }

  async createReview(customerId: string, productId: string, dto: ReviewDto) {
    // Check if the user has purchased or ordered the product
    const order = await this.prisma.order.findFirst({
      where: {
        customerId,
        orderItems: {
          some: {
            productId,
          },
        },
      },
    });

    if (!order) {
      throw new ForbiddenException(
        'You can only review products you have purchased.',
      );
    }

    return this.prisma.review.create({
      data: {
        ...dto,
        customerId,
        productId,
      },
    });
  }

  async updateReview(id: string, userId: string, dto: UpdateReviewDto) {
    return this.prisma.review.update({
      where: { id, customerId: userId },
      data: dto,
    });
  }

  async findReviewById(id: string) {
    return this.prisma.review.findUnique({
      where: { id },
    });
  }

  async findReviewsByProductId(productId: string) {
    return this.prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteReview(id: string, userId: string) {
    return this.prisma.review.deleteMany({
      where: { id, customerId: userId },
    });
  }
}
