import { PrismaService } from '@/prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { CartCreateDto, CartItemDto, UpdateCartItemDto } from './dto/cart.dto';

@Injectable()
export class CartsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string) {
    // First, try to find the cart by userId
    const existingCart = await this.prisma.cart.findFirst({
      where: { userId },
    });

    if (existingCart) {
      return existingCart;
    }

    // If not found, create a new cart
    return await this.prisma.cart.create({
      data: {
        userId,
      },
    });
  }

  async get(userId: string) {
    const cart = await this.prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              select: {
                id: true,
                imageUrl: true,
                price: true,
                product: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart) return null;

    // Map items to include required fields and calculate total per item
    const items = cart.items.map(
      (item: {
        id: string;
        productId: string;
        quantity: number;
        cartId: string;
        variantId: string;
        variant: {
          id: string;
          imageUrl: string | null;
          price: number;
          product: {
            name: string;
          };
        } | null;
      }) => {
        const variant = item.variant;
        if (!variant) {
          return {
            id: item.id,
            quantity: item.quantity,
            variantId: null,
            variantImage: null,
            variantPrice: null,
            productName: null,
            total: 0,
          };
        }
        const total = item.quantity * (variant.price || 0);
        return {
          id: item.id,
          quantity: item.quantity,
          variantId: variant.id,
          variantImage: variant.imageUrl,
          variantPrice: variant.price,
          productName: variant.product.name,
          total,
        };
      },
    );

    const allTotal = items.reduce((sum, item) => sum + item.total, 0);

    return {
      id: cart.id,
      userId: cart.userId,
      items,
      numberOfItems: items.length,
      total: allTotal,
    };
  }

  async deleteCart(userId: string) {
    const carts = await this.prisma.cart.findMany({
      where: { userId },
      select: { id: true },
    });

    const cartIds = carts.map((cart) => cart.id);

    await this.prisma.cartItem.deleteMany({
      where: {
        cartId: { in: cartIds },
      },
    });

    return await this.prisma.cart.deleteMany({
      where: {
        userId,
      },
    });
  }

  async addToCart(userId: string, dto: CartItemDto, cartId: string) {
    if (await this.isMyCart(userId, cartId)) {
      return await this.prisma.cartItem.create({
        data: {
          ...dto,
          cartId: cartId,
        },
      });
    }
    throw new ForbiddenException('Forbidden: Not your cart');
  }

  async updateCartItem(
    id: string,
    userId: string,
    dto: UpdateCartItemDto,
    cartId: string,
  ) {
    if (await this.isMyCart(userId, cartId)) {
      return await this.prisma.cartItem.update({
        where: { id },
        data: dto,
      });
    }
    throw new ForbiddenException('Forbidden: Not your cart');
  }

  async deleteCartItem(id: string, userId: string, cartId: string) {
    if (await this.isMyCart(userId, cartId)) {
      return await this.prisma.cartItem.delete({
        where: { id },
      });
    }
    throw new ForbiddenException('Forbidden: Not your cart');
  }

  async isMyCart(userId: string, cartId: string) {
    const cart = await this.prisma.cart.findFirst({
      where: { id: cartId, userId },
    });
    if (!cart) return false;
    return true;
  }
}
