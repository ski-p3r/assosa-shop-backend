import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product.dto';
import { Request } from 'express';
import { slugify } from '@/common/utils/slug.urils';

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        ...dto,
        slug: slugify(dto.name),
      },
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id   },
      data: {
        ...dto,
        ...(dto.name ? { slug: slugify(dto.name) } : {}),
      },
    });
  }

  async delete(id: string) {
    await this.prisma.productVariant.deleteMany({
      where: { productId: id },
    });
    return this.prisma.product.delete({ where: { id } });
  }

  async findOne(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        variants: true,
        // discounts: true,
        reviews: {
          include: {
            customer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                profileImage: true,
              },
            },
          },
        },
      },
    });
  }

  async findAll(query: ProductQueryDto, baseUrl?: string) {
    let {
      search,
      categoryId,
      page = 1,
      limit = 20,
      minPrice,
      maxPrice,
      minRating,
      maxRating,
    } = query;

    // Ensure page and limit are numbers (not strings)
    page = typeof page === 'string' ? parseInt(page, 10) : page;
    limit = typeof limit === 'string' ? parseInt(limit, 10) : limit;
    minPrice = typeof minPrice === 'string' ? parseFloat(minPrice) : minPrice;
    maxPrice = typeof maxPrice === 'string' ? parseFloat(maxPrice) : maxPrice;
    minRating =
      typeof minRating === 'string' ? parseFloat(minRating) : minRating;
    maxRating =
      typeof maxRating === 'string' ? parseFloat(maxRating) : maxRating;

    // Build where clause
    const where: any = {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { slug: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {},
        categoryId ? { categoryId } : {},
        minPrice !== undefined ? { basePrice: { gte: minPrice } } : {},
        maxPrice !== undefined ? { basePrice: { lte: maxPrice } } : {},
      ],
    };

    // If rating filter is present, filter after fetching (Prisma can't aggregate in where)
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          variants: { take: 1, orderBy: { id: 'asc' } },
          reviews: true,
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    // Calculate average rating and remove reviews from response
    const itemsWithRating = items
      .filter((product) => product.variants && product.variants.length > 0) // Only products with variants
      .map((product) => {
        const ratings = product.reviews?.map((r) => r.rating) || [];
        const avgRating = ratings.length
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : 0;
        // Remove reviews, add rating
        const { reviews, ...rest } = product;
        return {
          ...rest,
          rating: avgRating,
        };
      });

    // Filter by rating if needed
    let filteredItems = itemsWithRating;
    if (minRating !== undefined || maxRating !== undefined) {
      filteredItems = itemsWithRating.filter((product) => {
        if (minRating !== undefined && product.rating < minRating) return false;
        if (maxRating !== undefined && product.rating > maxRating) return false;
        return true;
      });
    }

    // Build next link
    let nextLink = null;
    if (skip + limit < total) {
      const params = new URLSearchParams({
        ...(query.search ? { search: query.search } : {}),
        ...(query.categoryId ? { categoryId: query.categoryId } : {}),
        ...(query.minPrice !== undefined
          ? { minPrice: query.minPrice.toString() }
          : {}),
        ...(query.maxPrice !== undefined
          ? { maxPrice: query.maxPrice.toString() }
          : {}),
        ...(query.minRating !== undefined
          ? { minRating: query.minRating.toString() }
          : {}),
        ...(query.maxRating !== undefined
          ? { maxRating: query.maxRating.toString() }
          : {}),
        page: (page + 1).toString(),
        limit: limit.toString(),
      });
      nextLink = baseUrl ? `${baseUrl}?${params}` : null;
    }

    return {
      items: filteredItems,
      total,
      page,
      limit,
      nextLink,
    };
  }

  async findOutOfStock(query: ProductQueryDto, baseUrl?: string) {
    let {
      search,
      categoryId,
      page = 1,
      limit = 20,
      minPrice,
      maxPrice,
      minRating,
      maxRating,
    } = query;

    // Ensure page and limit are numbers (not strings)
    page = typeof page === 'string' ? parseInt(page, 10) : page;
    limit = typeof limit === 'string' ? parseInt(limit, 10) : limit;
    minPrice = typeof minPrice === 'string' ? parseFloat(minPrice) : minPrice;
    maxPrice = typeof maxPrice === 'string' ? parseFloat(maxPrice) : maxPrice;
    minRating =
      typeof minRating === 'string' ? parseFloat(minRating) : minRating;
    maxRating =
      typeof maxRating === 'string' ? parseFloat(maxRating) : maxRating;

    // Build where clause for products
    const where: any = {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { slug: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {},
        categoryId ? { categoryId } : {},
        minPrice !== undefined ? { basePrice: { gte: minPrice } } : {},
        maxPrice !== undefined ? { basePrice: { lte: maxPrice } } : {},
      ],
    };

    // Pagination
    const skip = (page - 1) * limit;

    // Find variants that are out of stock
    const [variants, total] = await Promise.all([
      this.prisma.productVariant.findMany({
        where: {
          stockQuantity: { lt: 1 },
          product: where,
        },
        orderBy: { id: 'asc' },
        skip,
        take: limit,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              categoryId: true,
              description: true,
            },
          },
        },
      }),
      this.prisma.productVariant.count({
        where: {
          stockQuantity: { lt: 1 },
          product: where,
        },
      }),
    ]);

    // Filter by rating if needed
    let filteredVariants = variants;
    if (minRating !== undefined || maxRating !== undefined) {
      filteredVariants = variants.filter((variant) => {
        return true;
      });
    }

    // Build next link
    let nextLink = null;
    if (skip + limit < total) {
      const params = new URLSearchParams({
        ...(query.search ? { search: query.search } : {}),
        ...(query.categoryId ? { categoryId: query.categoryId } : {}),
        ...(query.minPrice !== undefined
          ? { minPrice: query.minPrice.toString() }
          : {}),
        ...(query.maxPrice !== undefined
          ? { maxPrice: query.maxPrice.toString() }
          : {}),
        ...(query.minRating !== undefined
          ? { minRating: query.minRating.toString() }
          : {}),
        ...(query.maxRating !== undefined
          ? { maxRating: query.maxRating.toString() }
          : {}),
        page: (page + 1).toString(),
        limit: limit.toString(),
      });
      nextLink = baseUrl ? `${baseUrl}?${params}` : null;
    }

    return {
      items: filteredVariants,
      total,
      page,
      limit,
      nextLink,
    };
  }
}
