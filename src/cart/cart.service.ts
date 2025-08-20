import { Injectable } from '@nestjs/common';
import { CartsRepository } from './cart.repository';
import { CartItemDto, UpdateCartItemDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly cartRepo: CartsRepository) {}

  async create(userId: string) {
    return await this.cartRepo.create(userId);
  }

  async getMyCart(userId: string) {
    return await this.cartRepo.get(userId);
  }

  async deleteCart(userId: string) {
    return await this.cartRepo.deleteCart(userId);
  }

  async addToCart(userId: string, dto: CartItemDto, cartId: string) {
    return await this.cartRepo.addToCart(userId, dto, cartId);
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateCartItemDto,
    cartId: string,
  ) {
    return await this.cartRepo.updateCartItem(id, userId, dto, cartId);
  }

  async deleteCartItem(id: string, userId: string, cartId: string) {
    return await this.cartRepo.deleteCartItem(id, userId, cartId);
  }
}
