import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { ProductsModule } from './products/products.module';
import { ProductVariantModule } from './product-variant/product-variant.module';
import { DiscountModule } from './discount/discount.module';
import { CartModule } from './cart/cart.module';
import { PromotionModule } from './promotion/promotion.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(4000),
        DATABASE_URL: Joi.string().required(),
        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
      }),
    }),
    PrismaModule,
    AuthModule,
    CategoryModule,
    ProductsModule,
    ProductVariantModule,
    DiscountModule,
    CartModule,
    PromotionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
