import { OtpRequestDto, OtpVerifyDto } from '@/auth/dto/otp.dto';
import { IOtp, IOtpSend } from '@/auth/interfaces/otp.interface';
import { OtpRepository } from '@/auth/repository/otp.repository';
import { generateOtpCode } from '@/common/utils/generator/otp.generator';
import { hashData, verifyHash } from '@/common/utils/hash';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OtpService {
  constructor(
    private readonly otpRepository: OtpRepository,
    private readonly configService: ConfigService,
  ) {}

  async sendOtp(oTPRequestDto: OtpRequestDto): Promise<IOtpSend> {
    // const API_URL = this.configService.get<string>('SMS_URL');
    // const TOKEN = this.configService.get<string>('TOKEN');
    // if (!API_URL) {
    //   throw new Error('SMS_URL is not defined');
    // }
    if (!oTPRequestDto.phone) {
      throw new BadRequestException('Phone number is required');
    }

    const existingOtp = await this.otpRepository.getUnique({
      phone: oTPRequestDto.phone,
    });

    let otp: string;
    //   const response = await fetch(`${API_URL}/otp`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       phone: oTPRequestDto.phone,
    //       token: TOKEN,
    //     }),
    //   }).then((res) => res.json());

    //   if (!response || response.error || !response.code) {
    //     throw new Error(
    //       'Failed to send OTP or invalid response from SMS provider',
    //     );
    //   }

    //   otp = response.code.toString();
    otp = generateOtpCode().toString();

    const hashedOtp = await hashData(otp);

    if (existingOtp) {
      await this.handleExistingOtp(oTPRequestDto, hashedOtp);
    } else {
      await this.createNewOtp(oTPRequestDto, hashedOtp);
    }
    return {
      success: true,
      message: 'OTP sent successfully',
    };
  }

  private async handleExistingOtp(
    dto: OtpRequestDto,
    hash: string,
  ): Promise<void> {
    await this.otpRepository.update({ phone: dto.phone }, { ...dto, hash });
  }

  async checkOtp(oTPCheckDto: OtpVerifyDto): Promise<IOtpSend> {
    const { code } = oTPCheckDto;
    const otp = await this.otpRepository.getUnique({
      phone: oTPCheckDto.phone,
    });
    code;
    if (!otp) throw new BadRequestException('OTP not found');
    const isVerified = await verifyHash(otp.hash, code);
    if (!isVerified) throw new BadRequestException('OTP verification failed');
    isVerified &&
      (await this.otpRepository.delete({ phone: oTPCheckDto.phone }));
    return {
      success: isVerified,
      message: isVerified
        ? 'OTP verified successfully'
        : 'OTP verification failed',
    };
  }

  private async createNewOtp(
    dto: OtpRequestDto,
    hashedOtp: string,
  ): Promise<void> {
    await this.otpRepository.create({
      ...dto,
      hash: hashedOtp,
    });
  }
}
