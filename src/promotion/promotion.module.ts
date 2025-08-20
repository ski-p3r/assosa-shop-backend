import { Module } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';
import { PromotionRepository } from './promotion.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [PromotionController],
  providers: [
    PromotionService,
    PromotionRepository,
    JwtService,
    ConfigService,
    PrismaService,
  ],
  exports: [PromotionService],
})
export class PromotionModule {}
