import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartsRepository } from './cart.repository';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [CartService, CartsRepository, JwtService],
  controllers: [CartController],
})
export class CartModule {}
