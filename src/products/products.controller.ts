import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { Request } from 'express';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../auth/dto/auth.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MASTER_ADMIN)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MASTER_ADMIN)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MASTER_ADMIN)
  delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }

  @Get()
  @ApiQuery({ name: 'search', required: false })
  findAll(@Query() query: ProductQueryDto, @Req() req: Request) {
    // Build baseUrl for nextLink
    const baseUrl = req.protocol + '://' + req.get('host') + req.path;
    return this.productsService.findAll(query, baseUrl);
  }

  @Get('out-of-stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ORDER_MANAGER)
  @ApiQuery({ name: 'search', required: false })
  findOutOfStock(@Query() query: ProductQueryDto, @Req() req: Request) {
    // Build baseUrl for nextLink
    const baseUrl = req.protocol + '://' + req.get('host') + req.path;
    return this.productsService.findOutOfStock(query, baseUrl);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }
}
