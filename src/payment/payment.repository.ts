import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { InvoiceQueryDto } from './dto/payment.dto';

@Injectable()
export class PaymentRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async initializeInvoice({
    orderId,
    invoiceNumber,
    pdfUrl,
    paymentStatus,
  }: {
    orderId: string;
    invoiceNumber: string;
    pdfUrl: string;
    paymentStatus: string;
  }) {
    return this.prismaService.invoice.create({
      data: {
        orderId,
        invoiceNumber,
        pdfUrl,
        paymentStatus,
      },
    });
  }

  async findInvoiceByOrderId(orderId: string) {
    return this.prismaService.invoice.findUnique({
      where: { orderId },
    });
  }

  async updateInvoiceStatus(orderId: string, paymentStatus: string) {
    return this.prismaService.invoice.update({
      where: { orderId },
      data: { paymentStatus },
    });
  }

  async findAllInvoices(query: InvoiceQueryDto) {
    return this.prismaService.invoice.findMany({ where: query });
  }

  async findInvoiceById(invoiceId: string) {
    return this.prismaService.invoice.findUnique({
      where: { id: invoiceId },
    });
  }

  async deleteInvoice(invoiceId: string) {
    return this.prismaService.invoice.delete({
      where: { id: invoiceId },
    });
  }

  async findMyInvoices(customerId: string, query?: InvoiceQueryDto) {
    return this.prismaService.invoice.findMany({
      where: { order: { customerId }, ...query },
      include: {
        order: {
          include: {
            orderItems: true,
            deliveryAssignment: true,
          },
        },
      },
    });
  }

  async getOrder(orderId: string, customerId: string) {
    return this.prismaService.order.findUniqueOrThrow({
      where: { id: orderId, customerId },
      include: {
        orderItems: {
          include: {
            product: true,
            variant: true,
          },
        },
        deliveryAssignment: true,
        customer: true,
      },
    });
  }

  async checkInvoiceExists(invoiceNumber: string) {
    const exist = await this.prismaService.invoice.findUnique({
      where: { invoiceNumber },
    });
    return !!exist;
  }
}
