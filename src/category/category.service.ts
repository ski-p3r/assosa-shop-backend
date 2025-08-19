import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryQueryDto,
} from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly repo: CategoryRepository) {}

  async create(dto: CreateCategoryDto) {
    return this.repo.create(dto);
  }

  async update(id: string, dto: UpdateCategoryDto) {
    return this.repo.update(id, dto);
  }

  async delete(id: string) {
    return this.repo.delete(id);
  }

  async findOne(id: string) {
    const category = await this.repo.findOne(id);
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async findAll(query: CategoryQueryDto) {
    return this.repo.findAll(query);
  }

  async findNested() {
    return this.repo.findNested();
  }

  async findRootCategories() {
    return this.repo.findRoot();
  }
}
