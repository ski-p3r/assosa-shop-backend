import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  AuthResponseDto,
  ForgotPasswordResponseDto,
  ResetPasswordResponseDto,
} from './dto/auth.dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOkResponse({ description: 'User registered', type: AuthResponseDto })
  @ApiBadRequestResponse({ description: 'Phone already registered' })
  async register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOkResponse({ description: 'User logged in', type: AuthResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @ApiOkResponse({ description: 'Tokens refreshed', type: AuthResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid refresh token' })
  async refresh(
    @Body() body: { userId: string; phone: string },
  ): Promise<AuthResponseDto> {
    return this.authService.refreshTokens(body.userId, body.phone);
  }

  @Post('forgot-password')
  @ApiOkResponse({ description: 'OTP sent', type: ForgotPasswordResponseDto })
  @ApiBadRequestResponse({ description: 'User not found' })
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponseDto> {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @ApiOkResponse({
    description: 'Password reset',
    type: ResetPasswordResponseDto,
  })
  @ApiBadRequestResponse({ description: 'User not found or OTP invalid' })
  async resetPassword(
    @Body() dto: ResetPasswordDto,
  ): Promise<ResetPasswordResponseDto> {
    return this.authService.resetPassword(dto);
  }
}
