import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { ProductVariantQueryDto } from './dto/product-variant-query.dto';
import { ProductVariantRepository } from './product-variant.repository';

@Injectable()
export class ProductVariantService {
  constructor(private readonly repo: ProductVariantRepository) {}

  async create(dto: CreateProductVariantDto) {
    return this.repo.create(dto);
  }

  async findAll(query: ProductVariantQueryDto = {}) {
    return this.repo.findAll(query);
  }

  async findOne(id: string) {
    const variant = await this.repo.findOne(id);
    if (!variant) {
      throw new NotFoundException('Product variant not found');
    }
    return variant;
  }

  async update(id: string, dto: UpdateProductVariantDto) {
    // Check if variant exists
    await this.findOne(id);
    return this.repo.update(id, dto);
  }

  async remove(id: string) {
    // Check if variant exists
    await this.findOne(id);
    return this.repo.delete(id);
  }

  async findByProductId(productId: string) {
    return this.repo.findByProductId(productId);
  }

  async updateStock(id: string, quantity: number) {
    if (quantity < 0) {
      throw new BadRequestException('Stock quantity cannot be negative');
    }

    // Check if variant exists
    await this.findOne(id);
    return this.repo.updateStock(id, quantity);
  }

  async findAvailableVariants(productId?: string) {
    return this.repo.findAvailableVariants(productId);
  }

  async toggleAvailability(id: string) {
    const variant = await this.findOne(id);
    const newStatus = !variant.isAvailable;

    return this.repo.update(id, { isAvailable: newStatus });
  }
}
