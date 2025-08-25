import { Injectable } from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { QueryPromotionDto } from './dto/query-promotion.dto';

@Injectable()
export class PromotionRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: CreatePromotionDto) {
    // Map dto to PromotionCreateInput, ensuring all required fields are present
    const { title, description, type, value, ...rest } = dto as any;
    return this.prisma.promotion.create({
      data: {
        title,
        description,
        type,
        value,
        ...rest,
      },
    });
  }
  async update(id: string, dto: CreatePromotionDto) {
    return this.prisma.promotion.update({ where: { id }, data: dto });
  }
  async findOne(id: string) {
    return this.prisma.promotion.findUnique({ where: { id } });
  }
  async delete(id: string) {
    return this.prisma.promotion.delete({ where: { id } });
  }
  async findMany(query: QueryPromotionDto) {
    const { search } = query;

    return this.prisma.promotion.findMany({
      where: {
        ...(search
          ? {
              title: {
                contains: search,
                mode: 'insensitive',
              },
            }
          : {}),
        ...(query.active
          ? {
              startDay: { lte: Date.now() },
              endDay: { gte: Date.now() },
            }
          : {}),
      },
    });
  }
}
