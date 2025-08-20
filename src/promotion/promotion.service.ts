import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { PromotionRepository } from './promotion.repository';
import { QueryPromotionDto } from './dto/query-promotion.dto';

@Injectable()
export class PromotionService {
  constructor(private readonly promotionRepository: PromotionRepository) {}
  async create(createPromotionDto: CreatePromotionDto) {
    return this.promotionRepository.create(createPromotionDto);
  }

  async findAll(query: QueryPromotionDto) {
    return this.promotionRepository.findMany(query);
  }

  async findOne(id: string) {
    const promotion = await this.promotionRepository.findOne(id);
    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }
    return promotion;
  }

  async update(id: string, updatePromotionDto: UpdatePromotionDto) {
    await this.findOne(id);
    const validDto: CreatePromotionDto = {
      ...updatePromotionDto,
      title: updatePromotionDto.title || '',
    };
    return this.promotionRepository.update(id, validDto);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.promotionRepository.delete(id);
  }
}
