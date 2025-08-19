import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsEnum,
  IsPhoneNumber,
} from 'class-validator';

export enum Role {
  CUSTOMER = 'CUSTOMER',
  MASTER_ADMIN = 'MASTER_ADMIN',
  ORDER_MANAGER = 'ORDER_MANAGER',
}

export class RegisterDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsPhoneNumber('ET')
  phone: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsString()
  address?: string;

  @ApiProperty({ required: false, default: 'English' })
  @IsString()
  @IsOptional()
  language?: string;

  @ApiProperty({ enum: Role, default: Role.CUSTOMER })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}

export class LoginDto {
  @ApiProperty()
  @IsPhoneNumber('ET')
  phone: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class ForgotPasswordDto {
  @ApiProperty()
  @IsPhoneNumber('ET')
  phone: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsPhoneNumber('ET')
  phone: string;

  @ApiProperty()
  @IsString()
  otp: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  newPassword: string;
}

export class UpdateProfileDto extends PartialType(RegisterDto) {}

export class AuthResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty({ required: false })
  refreshToken?: string;

  @ApiProperty()
  user: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    profileImage?: string;
    address?: string;
    language: string;
    role: string;
    status: string;
  };
}

export class ForgotPasswordResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;
}

export class ResetPasswordResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;
}
