import { Injectable } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { CreateOrderDto, UpdateOrderDto, OrderQueryDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async createOrder(customerId: string, dto: CreateOrderDto) {
    return this.orderRepository.createOrder(customerId, dto);
  }

  async updateOrder(id: string, dto: UpdateOrderDto) {
    return this.orderRepository.updateOrder(id, dto);
  }

  async findOrderById(id: string) {
    return this.orderRepository.findOrderById(id);
  }

  async findOrdersByCustomerId(
    customerId: string,
    query?: OrderQueryDto,
    baseUrl?: string,
  ) {
    return this.orderRepository.findOrdersByCustomerId(
      customerId,
      query,
      baseUrl,
    );
  }

  async findOrders(query: OrderQueryDto, baseUrl?: string) {
    return this.orderRepository.findOrders(query, baseUrl);
  }

  async deleteOrder(id: string) {
    return this.orderRepository.deleteOrder(id);
  }
}
