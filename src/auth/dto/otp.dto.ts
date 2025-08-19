import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString } from 'class-validator';

export class OtpRequestDto {
  @ApiProperty()
  @IsPhoneNumber('ET')
  phone: string;
}

export class OtpVerifyDto {
  @ApiProperty()
  @IsPhoneNumber('ET')
  phone: string;

  @ApiProperty()
  @IsString()
  code: string;
}
