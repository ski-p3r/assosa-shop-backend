import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { ProductVariantQueryDto } from './dto/product-variant-query.dto';

@Injectable()
export class ProductVariantRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductVariantDto) {
    return this.prisma.productVariant.create({
      data: dto,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            basePrice: true,
          },
        },
      },
    });
  }

  async update(id: string, dto: UpdateProductVariantDto) {
    return this.prisma.productVariant.update({
      where: { id },
      data: dto,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            basePrice: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    return this.prisma.productVariant.delete({ where: { id } });
  }

  async findOne(id: string) {
    return this.prisma.productVariant.findUnique({
      where: { id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            basePrice: true,
          },
        },
      },
    });
  }

  async findAll(query: ProductVariantQueryDto = {}) {
    const { search, productId, isAvailable, inStock } = query;

    return this.prisma.productVariant.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { variantName: { contains: search, mode: 'insensitive' } },
                  {
                    product: {
                      name: { contains: search, mode: 'insensitive' },
                    },
                  },
                ],
              }
            : {},
          productId ? { productId } : {},
          isAvailable !== undefined ? { isAvailable } : {},
          inStock !== undefined
            ? inStock
              ? { stockQuantity: { gt: 0 } }
              : { stockQuantity: { lte: 0 } }
            : {},
        ],
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            basePrice: true,
          },
        },
      },
    });
  }

  async findByProductId(productId: string) {
    return this.prisma.productVariant.findMany({
      where: { productId },
    });
  }

  async updateStock(id: string, quantity: number) {
    return this.prisma.productVariant.update({
      where: { id },
      data: { stockQuantity: quantity },
    });
  }

  async findAvailableVariants(productId?: string) {
    return this.prisma.productVariant.findMany({
      where: {
        AND: [
          { isAvailable: true },
          { stockQuantity: { gt: 0 } },
          productId ? { productId } : {},
        ],
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
  }
}
