import { Module } from '@nestjs/common';
import { OtpService } from './otp/services/otp.service';
import { OtpController } from './otp/controller/otp.controller';
import { OtpRepository } from './repository/otp.repository';
import { PrismaService } from '../prisma/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './repository/auth.repository';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [OtpController, AuthController],
  providers: [
    OtpService,
    OtpRepository,
    PrismaService,
    AuthService,
    AuthRepository,
    JwtService,
  ],
})
export class AuthModule {}
