import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { OtpService } from '../services/otp.service';
import { OtpRequestDto, OtpVerifyDto } from '@/auth/dto/otp.dto';
import { IOtpSend } from '@/auth/interfaces/otp.interface';

@ApiTags('otp')
@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('request')
  async requestOtp(@Body() oTPRequestDto: OtpRequestDto): Promise<IOtpSend> {
    return this.otpService.sendOtp(oTPRequestDto);
  }

  @Post('verify')
  async verifyOtp(@Body() oTPVerifyDto: OtpVerifyDto): Promise<IOtpSend> {
    return this.otpService.checkOtp(oTPVerifyDto);
  }
}
