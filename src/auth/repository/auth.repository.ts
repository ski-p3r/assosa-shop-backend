import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  RegisterDto,
  UpdateProfileDto,
  AuthResponseDto,
  ResetPasswordResponseDto,
} from '../dto/auth.dto';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(
    data: RegisterDto & { passwordHash: string },
  ): Promise<AuthResponseDto> {
    const { passwordHash, ...rest } = data;
    const user = await this.prisma.user.create({
      data: {
        ...rest,
        passwordHash,
      },
    });
    // You should generate tokens in the service, but for type safety, return user info here
    return {
      accessToken: '', // to be set in service
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
        profileImage: user.profileImage ?? undefined,
        address: user.address ?? undefined,
        language: user.language,
        role: user.role,
        status: user.status,
      },
    };
  }

  async findByPhone(phone: string) {
    return this.prisma.user.findUnique({ where: { phone } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async updateProfile(
    userId: string,
    data: UpdateProfileDto,
  ): Promise<AuthResponseDto> {
    const user = await this.prisma.user.update({ where: { id: userId }, data });
    return {
      accessToken: '',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
        profileImage: user.profileImage ?? undefined,
        address: user.address ?? undefined,
        language: user.language,
        role: user.role,
        status: user.status,
      },
    };
  }

  async updatePassword(
    userId: string,
    passwordHash: string,
  ): Promise<ResetPasswordResponseDto> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
    return { success: true, message: 'Password updated successfully' };
  }
}
