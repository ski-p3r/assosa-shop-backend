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
  RegisterAdminDto,
} from './dto/auth.dto';
import { hashData, verifyHash } from '@/common/utils/hash';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OtpRepository } from './repository/otp.repository';
import { generateOtpCode } from '@/common/utils/generator/otp.generator';
import { OtpService } from './otp/services/otp.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly otpRepository: OtpRepository,
    private readonly otpService: OtpService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private getTokens(userId: string) {
    const payload = { sub: userId };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: '30d', // 30 days
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: '60d', // 60 days
    });
    return { accessToken, refreshToken };
  }

  async createAdmin(dto: RegisterAdminDto): Promise<AuthResponseDto> {
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
    const tokens = this.getTokens(userRes.user.id);
    return { ...userRes, ...tokens };
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
    const tokens = this.getTokens(userRes.user.id);
    return { ...userRes, ...tokens };
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.authRepository.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await verifyHash(user.passwordHash, dto.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const tokens = this.getTokens(user.id);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
        profileImage: user.profileImage ?? '',
        address: user.address ?? '',
        language: user.language,
        role: user.role,
        status: user.status,
      },
    };
  }

  async refreshTokens(userId: string): Promise<AuthResponseDto> {
    const user = await this.authRepository.findById(userId);
    if (!user || user.id !== userId)
      throw new UnauthorizedException('Invalid refresh token');
    const tokens = this.getTokens(user.id);
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
    await this.otpService.sendOtp({ phone: dto.phone });

    return { success: true, message: 'OTP sent to phone' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.authRepository.findByPhone(dto.phone);
    if (!user) throw new BadRequestException('User not found');
    const isValid = await this.otpService.checkOtp({
      phone: dto.phone,
      code: dto.otp,
    });
    if (!isValid) throw new BadRequestException('Invalid OTP');
    const passwordHash = await hashData(dto.newPassword);
    return this.authRepository.updatePassword(user.id, passwordHash);
  }

  async getProfile(userId: string) {
    const user = await this.authRepository.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }

  async updateProfile(
    userId: string,
    dto: Partial<Omit<RegisterDto, 'password' | 'phone' | 'email'>>,
  ): Promise<AuthResponseDto> {
    const user = await this.authRepository.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');
    const userRes = await this.authRepository.updateProfile(userId, dto);
    const tokens = this.getTokens(userRes.user.id);
    return { ...userRes, ...tokens };
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.authRepository.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');
    return this.authRepository.changePassword(userId, oldPassword, newPassword);
  }
}
