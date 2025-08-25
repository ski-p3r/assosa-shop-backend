import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  RegisterDto,
  UpdateProfileDto,
  AuthResponseDto,
  ResetPasswordResponseDto,
  RegisterAdminDto,
} from '../dto/auth.dto';
import { hashData, verifyHash } from '@/common/utils/hash';

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

  async createAdmin(
    data: RegisterAdminDto & { passwordHash: string },
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
      accessToken: '',
      refreshToken: '',
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

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true,
        email: true,
        profileImage: true,
        address: true,
        language: true,
        role: true,
        status: true,
      },
    });
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');
    const isMatch = await verifyHash(user.passwordHash, oldPassword);
    if (!isMatch) throw new UnauthorizedException('Old password is incorrect');
    const passwordHash = await hashData(newPassword);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }
}
