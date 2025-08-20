import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { Request } from 'express';
import { CartItemDto, UpdateCartItemDto } from './dto/cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async createCart(@Req() req: Request & { user: { id: string } }) {
    const userId = req.user.id;
    return this.cartService.create(userId);
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getMyCart(@Req() req: Request & { user: { id: string } }) {
    if (req.user && 'id' in req.user) {
      return await this.cartService.getMyCart(req.user.id);
    }

    throw new UnauthorizedException();
  }

  @Post('/:cartId')
  @UseGuards(JwtAuthGuard)
  async addToCart(
    @Req() req: Request & { user: { id: string } },
    @Param('cartId') cartId: string,
    @Body() body: CartItemDto,
  ) {
    if (req.user && 'id' in req.user) {
      return await this.cartService.addToCart(req.user.id, body, cartId);
    }

    throw new UnauthorizedException();
  }

  @Put('/:cartId/:id')
  @UseGuards(JwtAuthGuard)
  async updateCartItem(
    @Req() req: Request & { user: { id: string } },
    @Param('cartId') cartId: string,
    @Param('id') id: string,
    @Body() body: UpdateCartItemDto,
  ) {
    if (req.user && 'id' in req.user) {
      return await this.cartService.update(id, req.user.id, body, cartId);
    }

    throw new UnauthorizedException();
  }

  @Delete('/')
  @UseGuards(JwtAuthGuard)
  async deleteCart(@Req() req: Request & { user: { id: string } }) {
    if (req.user && 'id' in req.user) {
      return await this.cartService.deleteCart(req.user.id);
    }

    throw new UnauthorizedException();
  }

  @Delete('/:cartId/:id')
  @UseGuards(JwtAuthGuard)
  async removeCartItem(
    @Req() req: Request & { user: { id: string } },
    @Param('cartId') cartId: string,
    @Param('id') id: string,
  ) {
    if (req.user && 'id' in req.user) {
      return await this.cartService.deleteCartItem(id, req.user.id, cartId);
    }

    throw new UnauthorizedException();
  }
}
