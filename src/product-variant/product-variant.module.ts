import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ProductVariantService } from './product-variant.service';
import { ProductVariantController } from './product-variant.controller';
import { ProductVariantRepository } from './product-variant.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ProductVariantController],
  providers: [
    ProductVariantService,
    ProductVariantRepository,
    JwtService,
    ConfigService,
    PrismaService,
  ],
  exports: [ProductVariantService],
})
export class ProductVariantModule {}
