import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CategoryController } from './category.controller';
import { CategoryRepository } from './category.repository';
import { CategoryService } from './category.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [CategoryController],
  providers: [
    CategoryRepository,
    CategoryService,
    JwtService,
    ConfigService,
    PrismaService,
  ],
})
export class CategoryModule {}
