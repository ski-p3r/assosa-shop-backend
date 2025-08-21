import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CreateOrderDto, OrderQueryDto, UpdateOrderDto } from './dto/order.dto';
import type { Request } from 'express';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Role } from '@/auth/dto/auth.dto';
import { Roles } from '@/common/decorators/roles.decorator';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async createOrder(
    @Req() req: Request & { user: { id: string } },
    @Body() body: CreateOrderDto,
  ) {
    const userId = req.user.id;
    return this.orderService.createOrder(userId, body);
  }

  @Post('/update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MASTER_ADMIN)
  async updateOrder(
    @Req() req: Request & { user: { id: string } },
    @Body() body: UpdateOrderDto,
    @Param('id') id: string,
  ) {
    return this.orderService.updateOrder(id, body);
  }

  @Get('/my')
  @UseGuards(JwtAuthGuard)
  async getMyOrders(
    @Req() req: Request & { user: { id: string } },
    @Query() query: OrderQueryDto,
  ) {
    const userId = req.user.id;
    const baseUrl = req.protocol + '://' + req.get('host') + req.path;
    return this.orderService.findOrdersByCustomerId(userId, query, baseUrl);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getOrderById(@Param('id') id: string) {
    return this.orderService.findOrderById(id);
  }

  @Get('/')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MASTER_ADMIN)
  async getAllOrders(@Query() query: OrderQueryDto, @Req() req: Request) {
    const baseUrl = req.protocol + '://' + req.get('host') + req.path;
    return this.orderService.findOrders(query, baseUrl);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MASTER_ADMIN)
  async deleteOrder(@Param('id') id: string) {
    return this.orderService.deleteOrder(id);
  }
}
