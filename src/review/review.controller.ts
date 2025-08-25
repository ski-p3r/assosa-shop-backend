import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ReviewDto, UpdateReviewDto } from './dto/review.dto';
import { Request } from 'express';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('/:productId')
  @UseGuards(JwtAuthGuard)
  async createReview(
    @Body() reviewDto: ReviewDto,
    @Param('productId') productId: string,
    @Req() req: Request & { user: { id: string } },
  ) {
    const customerId = req.user.id;
    return this.reviewService.createReview(customerId, productId, reviewDto);
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async updateReview(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @Req() req: Request & { user: { id: string } },
  ) {
    const userId = req.user.id;
    return this.reviewService.updateReview(id, userId, updateReviewDto);
  }

  @Get('/:productId/can-review')
  @UseGuards(JwtAuthGuard)
  async canIReviewProduct(
    @Param('productId') productId: string,
    @Req() req: Request & { user: { id: string } },
  ) {
    const customerId = req.user.id;
    return this.reviewService.canIReviewProduct(customerId, productId);
  }

  @Get('/:productId')
  @UseGuards(JwtAuthGuard)
  async findReviewsByProductId(@Param('productId') productId: string) {
    return this.reviewService.findReviewsByProductId(productId);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteReview(
    @Param('id') id: string,
    @Req() req: Request & { user: { id: string } },
  ) {
    const userId = req.user.id;
    return this.reviewService.deleteReview(id, userId);
  }
}
