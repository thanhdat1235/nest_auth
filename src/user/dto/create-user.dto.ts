import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNumberString,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @ApiProperty()
  username: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  password: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  role: string;

  @IsBoolean()
  @ApiProperty()
  @IsOptional()
  published: boolean;

  @IsBoolean()
  @ApiProperty()
  @IsOptional()
  createdAt: Date;

  @IsBoolean()
  @ApiProperty()
  @IsOptional()
  updatedAt: Date;
}
