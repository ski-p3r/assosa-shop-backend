import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './products.repository';
import { ProductQueryDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly repo: ProductsRepository) {}

  async create(dto: CreateProductDto) {
    return this.repo.create(dto);
  }

  async findAll(query: ProductQueryDto = {}, baseUrl?: string) {
    return this.repo.findAll(query, baseUrl);
  }

  async findOutOfStock(query: ProductQueryDto = {}, baseUrl?: string) {
    return this.repo.findOutOfStock(query, baseUrl);
  }

  async findOne(id: string) {
    const product = await this.repo.findOne(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);
    return this.repo.update(id, dto);
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.repo.delete(id);
  }
}
