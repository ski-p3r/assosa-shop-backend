import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryQueryDto,
} from './dto/category.dto';
import { slugify } from '@/common/utils/slug.urils';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        ...dto,
        slug: slugify(dto.name ?? ''),
        parentId: dto.parentId || null, // Ensure parentId is null if not provided
      },
    });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.name ? { slug: slugify(dto.name) } : {}),
      },
    });
  }

  async delete(id: string) {
    return this.prisma.category.delete({ where: { id } });
  }

  async findOne(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
      include: { children: true, parent: true },
    });
  }

  async findAll(query: CategoryQueryDto) {
    const { search, parentId } = query;
    return this.prisma.category.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { name: { contains: search, mode: 'insensitive' } },
                  { slug: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {},
          parentId ? { parentId } : { parentId: null },
        ],
      },
      orderBy: { name: 'asc' },
    });
  }

  async findNested() {
    return this.prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            children: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findRoot() {
    // Categories with no parent and no children
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }
}
