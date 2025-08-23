import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  AuthResponseDto,
  ForgotPasswordResponseDto,
  ResetPasswordResponseDto,
  UpdateProfileDto,
  ChangePasswordDto,
} from './dto/auth.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

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

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: Request & { user: { id: string } }) {
    const { id } = req.user;
    return this.authService.getProfile(id);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Req() req: Request & { user: { id: string } },
    @Body() body: ChangePasswordDto,
  ) {
    const { id } = req.user;
    return this.authService.changePassword(
      id,
      body.oldPassword,
      body.newPassword,
    );
  }

  @Put('update-profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Req() req: Request & { user: { id: string } },
    @Body() body: UpdateProfileDto,
  ) {
    const { id } = req.user;
    return this.authService.updateProfile(id, body);
  }
}
