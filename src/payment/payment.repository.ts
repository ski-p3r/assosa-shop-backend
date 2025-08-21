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

  async findAllInvoices(query: InvoiceQueryDto = {}, baseUrl?: string) {
    let { page = 1, limit = 20, paymentStatus } = query;
    page = typeof page === 'string' ? parseInt(page, 10) : page;
    limit = typeof limit === 'string' ? parseInt(limit, 10) : limit;
    const skip = (page - 1) * limit;
    const where: any = {
      ...(paymentStatus ? { paymentStatus } : {}),
    };
    const [items, total] = await Promise.all([
      this.prismaService.invoice.findMany({
        where,
        skip,
        take: limit,
      }),
      this.prismaService.invoice.count({ where }),
    ]);
    let nextLink = null;
    if (skip + limit < total) {
      const params = new URLSearchParams({
        ...(paymentStatus ? { paymentStatus } : {}),
        page: (page + 1).toString(),
        limit: limit.toString(),
      });
      nextLink = baseUrl ? `${baseUrl}?${params}` : null;
    }
    return { items, total, page, limit, nextLink };
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

  async findMyInvoices(
    customerId: string,
    query: InvoiceQueryDto = {},
    baseUrl?: string,
  ) {
    let { page = 1, limit = 20, paymentStatus } = query;
    page = typeof page === 'string' ? parseInt(page, 10) : page;
    limit = typeof limit === 'string' ? parseInt(limit, 10) : limit;
    const skip = (page - 1) * limit;
    const where: any = {
      order: { customerId },
      ...(paymentStatus ? { paymentStatus } : {}),
    };
    const [items, total] = await Promise.all([
      this.prismaService.invoice.findMany({
        where,
        include: {
          order: {
            include: {
              orderItems: true,
              deliveryAssignment: true,
            },
          },
        },
        skip,
        take: limit,
      }),
      this.prismaService.invoice.count({ where }),
    ]);
    let nextLink = null;
    if (skip + limit < total) {
      const params = new URLSearchParams({
        ...(paymentStatus ? { paymentStatus } : {}),
        page: (page + 1).toString(),
        limit: limit.toString(),
      });
      nextLink = baseUrl ? `${baseUrl}?${params}` : null;
    }
    return { items, total, page, limit, nextLink };
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

  async getOrderForChapa(orderId: string) {
    return this.prismaService.order.findUniqueOrThrow({
      where: { id: orderId },
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

  async updateOrderStatusByInvoiceNumber(orderId: string, status: string) {
    return this.prismaService.order.update({
      where: { id: orderId },
      data: { paymentStatus: status },
    });
  }

  async checkInvoiceExists(invoiceNumber: string) {
    const exist = await this.prismaService.invoice.findUnique({
      where: { invoiceNumber },
    });
    return !!exist;
  }
}
