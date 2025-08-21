import { PrismaService } from '@/prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateOrderDto, UpdateOrderDto, OrderQueryDto } from './dto/order.dto';

@Injectable()
export class OrderRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createOrder(customerId: string, data: CreateOrderDto) {
    // Fetch cart and items with product/variant info
    const cart = await this.prismaService.cart.findUnique({
      where: { id: data.cartId },
      include: { items: { include: { variant: true, product: true } } },
    });
    if (!cart) throw new Error('Cart not found');

    // Check variant quantity
    for (const item of cart.items) {
      if (item.variantId) {
        if (!item.variant) throw new Error('Variant not found');
      }
    }

    const totalPrice = cart.items.reduce(
      (sum, item) =>
        sum +
        (item.variant?.price ?? item.product.basePrice ?? 0) * item.quantity,
      0,
    );

    // Transaction: create order, order items, decrease variant quantity, clear cart
    return this.prismaService.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          customerId,
          status: 'pending',
          totalPrice,
          paymentMethod: data.paymentMethod,
          paymentStatus: 'pending',
          orderItems: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              price: item.variant?.price ?? item.product.basePrice ?? 0,
              status: 'pending',
            })),
          },
        },
        include: { orderItems: true },
      });

      // Decrease variant quantity
      for (const item of cart.items) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stockQuantity: { decrement: item.quantity } },
          });
        }
      }

      // Optionally clear cart after order
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return order;
    });
  }

  async updateOrder(id: string, data: UpdateOrderDto) {
    return this.prismaService.order.update({
      where: { id },
      data,
    });
  }

  async findOrderById(id: string) {
    return this.prismaService.order.findUnique({
      where: { id },
      include: {
        orderItems: true,
        invoice: true,
        deliveryAssignment: true,
      },
    });
  }

  async findOrdersByCustomerId(
    customerId: string,
    query: OrderQueryDto = {},
    baseUrl?: string,
  ) {
    let { page = 1, limit = 20, status, paymentStatus, search } = query;
    page = typeof page === 'string' ? parseInt(page, 10) : page;
    limit = typeof limit === 'string' ? parseInt(limit, 10) : limit;
    const skip = (page - 1) * limit;
    const where: any = {
      customerId,
      ...(status ? { status } : {}),
      ...(paymentStatus ? { paymentStatus } : {}),
      ...(search
        ? {
            OR: [
              { id: { contains: search, mode: 'insensitive' } },
              { status: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };
    const [items, total] = await Promise.all([
      this.prismaService.order.findMany({
        where,
        include: {
          orderItems: true,
          invoice: true,
          deliveryAssignment: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.order.count({ where }),
    ]);
    let nextLink = null;
    if (skip + limit < total) {
      const params = new URLSearchParams({
        ...(search ? { search } : {}),
        ...(status ? { status } : {}),
        ...(paymentStatus ? { paymentStatus } : {}),
        page: (page + 1).toString(),
        limit: limit.toString(),
      });
      nextLink = baseUrl ? `${baseUrl}?${params}` : null;
    }
    return { items, total, page, limit, nextLink };
  }

  async findOrders(query: OrderQueryDto = {}, baseUrl?: string) {
    let { page = 1, limit = 20, status, paymentStatus, search } = query;
    page = typeof page === 'string' ? parseInt(page, 10) : page;
    limit = typeof limit === 'string' ? parseInt(limit, 10) : limit;
    const skip = (page - 1) * limit;
    const where: any = {
      ...(status ? { status } : {}),
      ...(paymentStatus ? { paymentStatus } : {}),
      ...(search
        ? {
            OR: [
              { id: { contains: search, mode: 'insensitive' } },
              { status: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };
    const [items, total] = await Promise.all([
      this.prismaService.order.findMany({
        where,
        include: {
          orderItems: true,
          invoice: true,
          deliveryAssignment: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.order.count({ where }),
    ]);
    let nextLink = null;
    if (skip + limit < total) {
      const params = new URLSearchParams({
        ...(search ? { search } : {}),
        ...(status ? { status } : {}),
        ...(paymentStatus ? { paymentStatus } : {}),
        page: (page + 1).toString(),
        limit: limit.toString(),
      });
      nextLink = baseUrl ? `${baseUrl}?${params}` : null;
    }
    return { items, total, page, limit, nextLink };
  }

  async deleteOrder(id: string) {
    return this.prismaService.order.delete({
      where: { id },
    });
  }
}
