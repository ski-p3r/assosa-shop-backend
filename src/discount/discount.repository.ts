import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';

@Injectable()
export class DiscountRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: CreateDiscountDto) {
    return this.prisma.discount.create({ data: dto });
  }
  async update(id: string, dto: UpdateDiscountDto) {
    return this.prisma.discount.update({ where: { id }, data: dto });
  }
  async findOne(id: string) {
    return this.prisma.discount.findUnique({ where: { id } });
  }
  async Delete(id: string) {
    return this.prisma.discount.delete({ where: { id } });
  }
  async findMany() {
    return this.prisma.discount.findMany();
  }
}
