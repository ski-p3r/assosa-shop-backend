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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiQuery, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductVariantService } from './product-variant.service';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { ProductVariantQueryDto } from './dto/product-variant-query.dto';
import { ProductVariantDto } from './dto/product-variant.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../auth/dto/auth.dto';

@ApiTags('product-variants')
@Controller('product-variants')
export class ProductVariantController {
  constructor(private readonly productVariantService: ProductVariantService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MASTER_ADMIN)
  @ApiOperation({ summary: 'Create a new product variant' })
  @ApiResponse({
    status: 201,
    description: 'Product variant created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  create(@Body() createProductVariantDto: CreateProductVariantDto) {
    return this.productVariantService.create(createProductVariantDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all product variants with optional filtering' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search in variant name or product name',
  })
  @ApiQuery({
    name: 'productId',
    required: false,
    description: 'Filter by product ID',
  })
  @ApiQuery({
    name: 'isAvailable',
    required: false,
    description: 'Filter by availability',
  })
  @ApiQuery({
    name: 'inStock',
    required: false,
    description: 'Filter by stock availability',
  })
  @ApiResponse({
    status: 200,
    description: 'Product variants retrieved successfully',
    type: [ProductVariantDto],
  })
  findAll(@Query() query: ProductVariantQueryDto) {
    return this.productVariantService.findAll(query);
  }

  @Get('available')
  @ApiOperation({ summary: 'Get all available product variants' })
  @ApiQuery({
    name: 'productId',
    required: false,
    description: 'Filter by product ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Available variants retrieved successfully',
    type: [ProductVariantDto],
  })
  findAvailableVariants(@Query('productId') productId?: string) {
    return this.productVariantService.findAvailableVariants(productId);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get all variants for a specific product' })
  @ApiResponse({
    status: 200,
    description: 'Product variants retrieved successfully',
    type: [ProductVariantDto],
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findByProductId(@Param('productId') productId: string) {
    return this.productVariantService.findByProductId(productId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific product variant by ID' })
  @ApiResponse({
    status: 200,
    description: 'Product variant retrieved successfully',
    type: ProductVariantDto,
  })
  @ApiResponse({ status: 404, description: 'Product variant not found' })
  findOne(@Param('id') id: string) {
    return this.productVariantService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MASTER_ADMIN)
  @ApiOperation({ summary: 'Update a product variant' })
  @ApiResponse({
    status: 200,
    description: 'Product variant updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Product variant not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  update(
    @Param('id') id: string,
    @Body() updateProductVariantDto: UpdateProductVariantDto,
  ) {
    return this.productVariantService.update(id, updateProductVariantDto);
  }

  @Put(':id/stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MASTER_ADMIN)
  @ApiOperation({ summary: 'Update stock quantity for a product variant' })
  @ApiResponse({
    status: 200,
    description: 'Stock updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid quantity' })
  @ApiResponse({ status: 404, description: 'Product variant not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  updateStock(@Param('id') id: string, @Body('quantity') quantity: number) {
    return this.productVariantService.updateStock(id, quantity);
  }

  @Put(':id/toggle-availability')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MASTER_ADMIN)
  @ApiOperation({ summary: 'Toggle availability of a product variant' })
  @ApiResponse({
    status: 200,
    description: 'Availability toggled successfully',
  })
  @ApiResponse({ status: 404, description: 'Product variant not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  toggleAvailability(@Param('id') id: string) {
    return this.productVariantService.toggleAvailability(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MASTER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a product variant' })
  @ApiResponse({
    status: 204,
    description: 'Product variant deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Product variant not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  remove(@Param('id') id: string) {
    return this.productVariantService.remove(id);
  }
}
