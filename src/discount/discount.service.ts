import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { DiscountRepository } from './discount.repository';

@Injectable()
export class DiscountService {
  constructor(private readonly repo: DiscountRepository) {}
  async create( createDiscountDto: CreateDiscountDto) {
    return await this.repo.create(createDiscountDto);
  }

  async findAll() {
    return this.repo.findMany();
  }

  async findOne(id: string) {
    const discount = await this.repo.findOne(id);
    if (!discount) {
      throw new NotFoundException('Product variant not found');
    }
    return discount;
  }

  async update(id: string, updateDiscountDto: UpdateDiscountDto) {
    await this.findOne(id);
    return this.repo.update(id, updateDiscountDto);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.repo.Delete(id);
  }
}
