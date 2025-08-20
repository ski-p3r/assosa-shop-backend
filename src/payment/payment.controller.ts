import {
  Body,
  Controller,
  Get,
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
    return this.paymentService.initializeInvoice(
      initializePaymentDto,
      id,
      'ON_DELIVERY',
    );
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

  @Get('/my')
  @UseGuards(JwtAuthGuard)
  async getMyInvoices(
    @Req() req: Request & { user: { id: string } },
    @Query() query: InvoiceQueryDto,
  ) {
    const { id } = req.user;
    return this.paymentService.findMyInvoices(id, query);
  }

  @Get('/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MASTER_ADMIN, Role.ORDER_MANAGER)
  async getAllInvoices(@Query() query: InvoiceQueryDto) {
    return this.paymentService.findAllInvoices(query);
  }
}
