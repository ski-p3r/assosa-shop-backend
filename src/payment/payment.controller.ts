import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { InitializePaymentDto, InvoiceQueryDto } from './dto/payment.dto';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Role } from '@/auth/dto/auth.dto';
import { Roles } from '@/common/decorators/roles.decorator';
import * as crypto from 'crypto';
import type { Request } from 'express';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/initialize/chapa')
  @UseGuards(JwtAuthGuard)
  async initializePayment(
    @Req() req: Request & { user: { id: string } },
    @Body() initializePaymentDto: InitializePaymentDto,
  ) {
    const { id } = req.user;
    return this.paymentService.chapaPayment(initializePaymentDto, id);
  }

  @Post('/initialize/on-delivery')
  @UseGuards(JwtAuthGuard)
  async initializeOnDeliveryPayment(
    @Req() req: Request & { user: { id: string } },
    @Body() initializePaymentDto: InitializePaymentDto,
  ) {
    const { id } = req.user;
    return this.paymentService.initializeInvoice(initializePaymentDto, id);
  }

  @Post('/update-status')
  @UseGuards(JwtAuthGuard)
  async updatePaymentStatus(
    @Req() req: Request & { user: { id: string } },
    @Body() updatePaymentStatusDto: { orderId: string; paymentStatus: string },
  ) {
    const { id } = req.user;
    return this.paymentService.updatePaymentStatus(
      updatePaymentStatusDto.orderId,
      updatePaymentStatusDto.paymentStatus,
    );
  }

  @Get('/verify/chapa/:invoiceNumber')
  @UseGuards(JwtAuthGuard)
  async verifyChapaPayment(
    @Req() req: Request & { user: { id: string } },
    @Param('invoiceNumber') invoiceNumber: string,
  ) {
    return this.paymentService.verifyChapaPayment(invoiceNumber);
  }

  @Get('/reinitialize/chapa/:invoiceNumber')
  @UseGuards(JwtAuthGuard)
  async reinitializeChapaPayment(
    @Req() req: Request & { user: { id: string } },
    @Param('invoiceNumber') invoiceNumber: string,
  ) {
    return this.paymentService.reInitializeChapaPayment(invoiceNumber);
  }

  @Post('/webhook/chapa')
  async chapaWebhook(@Req() req: any, @Body() body: any) {
    const secret = process.env.CHAPA_SECRET_HASH || '';
    const chapaSignature =
      req.headers['chapa-signature'] || req.headers['Chapa-Signature'];
    const xChapaSignature =
      req.headers['x-chapa-signature'] || req.headers['X-Chapa-Signature'];
    // Ensure body is defined and serializable
    const payload = body ? JSON.stringify(body) : '';

    if (!payload) {
      return { status: 400, message: 'Empty body' };
    }

    // Compute hashes
    const hashChapaSignature = crypto
      .createHmac('sha256', secret)
      .update(secret)
      .digest('hex');
    const hashXChapaSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    const isChapaSignatureValid =
      chapaSignature && chapaSignature === hashChapaSignature;
    const isXChapaSignatureValid =
      xChapaSignature && xChapaSignature === hashXChapaSignature;

    if (!isChapaSignatureValid && !isXChapaSignatureValid) {
      return { status: 401, message: 'Invalid signature' };
    }

    await this.paymentService.handleChapaWebhook(body);
    return { status: 200 };
  }

  @Get('/my')
  @UseGuards(JwtAuthGuard)
  async getMyInvoices(
    @Req() req: Request & { user: { id: string } },
    @Query() query: InvoiceQueryDto,
  ) {
    const { id } = req.user;
    const baseUrl = req.protocol + '://' + req.get('host') + req.path;
    return this.paymentService.findMyInvoices(id, query, baseUrl);
  }

  @Get('/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MASTER_ADMIN)
  async getAllInvoices(@Query() query: InvoiceQueryDto, @Req() req: Request) {
    const baseUrl = req.protocol + '://' + req.get('host') + req.path;
    return this.paymentService.findAllInvoices(query, baseUrl);
  }
}
