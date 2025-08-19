import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from './repository/auth.repository';
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  AuthResponseDto,
  ForgotPasswordResponseDto,
  ResetPasswordResponseDto,
} from './dto/auth.dto';
import { hashData, verifyHash } from '@/common/utils/hash';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private getTokens(userId: string, phone: string) {
    const payload = { sub: userId, phone };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const existing = await this.authRepository.findByPhone(dto.phone);
    if (existing) throw new BadRequestException('Phone already registered');
    const passwordHash = await hashData(dto.password);
    // Remove password from dto before passing
    const { password, ...rest } = dto;
    // Fix: add type assertion to satisfy RegisterDto & { passwordHash: string }
    const userRes = await this.authRepository.createUser({
      ...(rest as Omit<RegisterDto, 'password'>),
      passwordHash,
    } as RegisterDto & { passwordHash: string });
    const tokens = this.getTokens(userRes.user.id, userRes.user.phone);
    return { ...userRes, ...tokens };
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.authRepository.findByPhone(dto.phone);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await verifyHash(user.passwordHash, dto.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const tokens = this.getTokens(user.id, user.phone);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
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

  async refreshTokens(userId: string, phone: string): Promise<AuthResponseDto> {
    const user = await this.authRepository.findByPhone(phone);
    if (!user || user.id !== userId)
      throw new UnauthorizedException('Invalid refresh token');
    const tokens = this.getTokens(user.id, user.phone);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
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

  async forgotPassword(
    dto: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponseDto> {
    const user = await this.authRepository.findByPhone(dto.phone);
    if (!user) throw new BadRequestException('User not found');
    // Here you would send OTP or reset link
    return { success: true, message: 'OTP sent to phone' };
  }

  async resetPassword(
    dto: ResetPasswordDto,
  ): Promise<ResetPasswordResponseDto> {
    const user = await this.authRepository.findByPhone(dto.phone);
    if (!user) throw new BadRequestException('User not found');
    // Here you would verify OTP
    const passwordHash = await hashData(dto.newPassword);
    return this.authRepository.updatePassword(user.id, passwordHash);
  }
}
