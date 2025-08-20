import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentRepository } from './payment.repository';
import { InitializePaymentDto, InvoiceQueryDto } from './dto/payment.dto';
import axios from 'axios';

@Injectable()
export class PaymentService {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async chapaPayment(dto: InitializePaymentDto, customerId: string) {
    const invoiceNumber = this.generateInvoiceNumber();
    const order = await this.paymentRepository.getOrder(
      dto.orderId,
      customerId,
    );

    if (!order) {
      throw new NotFoundException(
        'Order not found or does not belong to the customer',
      );
    }

    const chapaPayload = {
      amount: order.orderItems
        .reduce((sum: number, item: any) => sum + item.quantity * item.price, 0)
        .toString(),
      currency: 'ETB',
      first_name: order.customer.firstName,
      last_name: order.customer.lastName,
      tx_ref: invoiceNumber,
      'customization[title]': 'Order Payment',
      'customization[description]':
        'Payment for order ' + invoiceNumber.replace(/[^a-zA-Z0-9 ]/g, ''),
    };

    const response = await axios.post(
      'https://api.chapa.co/v1/transaction/initialize',
      chapaPayload,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    // ✅ Return only the relevant part (avoids circular structure)
    return response.data;
  }

  async initializeInvoice(
    dto: InitializePaymentDto,
    customerId: string,
    paymentMethod: string,
  ) {
    const invoiceNumber = this.generateInvoiceNumber();
    const order = await this.paymentRepository.getOrder(
      dto.orderId,
      customerId,
    );

    if (!order) {
      throw new NotFoundException(
        'Order not found or does not belong to the customer',
      );
    }

    const chapaPayload = {
      amount: order.orderItems
        .reduce((sum: number, item: any) => sum + item.quantity * item.price, 0)
        .toString(),
      currency: 'ETB',
      email: order.customer.email,
      first_name: order.customer.firstName,
      last_name: order.customer.lastName,
      tx_ref: invoiceNumber,
      'customization[title]': 'Payment for my Order',
      'customization[description]': 'Payment for order #' + invoiceNumber,
    };

    if (paymentMethod === 'CHAPA') {
      await axios.post(
        'https://api.chapa.co/v1/transaction/initialize',
        chapaPayload,
        {
          headers: {
            Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );
    }

    // Prepare invoice payload based on order details
    const invoicePayload = {
      invoiceNumber,
      shopName: 'Assosa Shop',
      shopAddress: '123 Assosa St, Assosa, Ethiopia',
      shopEmail: 'support@assosashop.com',
      shopPhone: '+251-911-000-000',
      billingDetails: {
        name: order.customer.firstName + ' ' + order.customer.lastName,
        email: order.customer.email,
        phone: order.customer.phone,
        address: order.customer.address,
      },
      shippingDetails: {
        name: order.customer.firstName + ' ' + order.customer.lastName,
        phone: order.customer.phone,
        address: order.customer.address,
        country: 'Ethiopia',
      },
      items: order.orderItems.map((item: any) => ({
        product: item.productName,
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price,
      })),
      subtotal: order.orderItems.reduce(
        (sum: number, item: any) => sum + item.quantity * item.price,
        0,
      ),
      shipping: 0,
      total: order.orderItems.reduce(
        (sum: number, item: any) => sum + item.quantity * item.price,
        0,
      ),
      paymentMethod: order.paymentMethod,
      transactionId: invoiceNumber,
      footerNote:
        'Thank you for your purchase! If you have any questions, contact us at support@assosashop.com',
    };

    const response = await axios.post(
      `${process.env.UPLOAD_URL}/generate-invoice`,
      invoicePayload,
      {
        headers: {
          'x-upload-token': `${process.env.UPLOAD_TOKEN}`,
        },
      },
    );

    if (response.status !== 200) {
      throw new NotFoundException('Failed to generate invoice PDF');
    }

    return this.paymentRepository.initializeInvoice({
      ...dto,
      invoiceNumber,
      pdfUrl: response.data.url,
      paymentStatus: 'PENDING',
    });
  }

  async updatePaymentStatus(orderId: string, paymentStatus: string) {
    const invoice = await this.paymentRepository.findInvoiceById(orderId);
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }
    return this.paymentRepository.updateInvoiceStatus(orderId, paymentStatus);
  }

  async findAllInvoices(query: InvoiceQueryDto) {
    return this.paymentRepository.findAllInvoices(query);
  }

  async findInvoiceById(invoiceId: string) {
    const invoice = await this.paymentRepository.findInvoiceById(invoiceId);
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }
    return invoice;
  }

  async findMyInvoices(customerId: string, query?: InvoiceQueryDto) {
    return this.paymentRepository.findMyInvoices(customerId, query);
  }

  private generateInvoiceNumber(): string {
    const timestamp = Date.now().toString();
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `INV-${timestamp}-${randomPart}`;
  }
}
