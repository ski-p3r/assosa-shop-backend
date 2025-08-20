import { Module } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { DiscountRepository } from './discount.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [DiscountController],
  providers: [
    DiscountService,
    DiscountRepository,
    JwtService,
    ConfigService,
    PrismaService,
  ],
})
export class DiscountModule {}
