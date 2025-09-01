import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IOtp, IOtpGet, IOtpSet } from '../interfaces/otp.interface';

@Injectable()
export class OtpRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(iOtpSet: IOtpSet): Promise<IOtp> {
    return await this.prismaService.oTP.create({
      data: iOtpSet,
    });
  }

  async upsert(iOtpGet: IOtpGet, iOtpSet: IOtpSet): Promise<IOtp> {
    return await this.prismaService.oTP.upsert({
      where: iOtpGet,
      update: iOtpSet,
      create: { ...iOtpGet, ...iOtpSet },
    });
  }

  async getUnique(iOtpGet: IOtpGet): Promise<IOtp | null> {
    return await this.prismaService.oTP.findUnique({
      where: iOtpGet,
    });
  }

  async update(iOtpGet: IOtpGet, iOtpSet: IOtpSet): Promise<void> {
    await this.prismaService.oTP.update({
      where: iOtpGet,
      data: iOtpSet,
    });
  }

  async delete(iOtpGet: IOtpGet): Promise<void> {
    await this.prismaService.oTP.delete({
      where: iOtpGet,
    });
  }
}
