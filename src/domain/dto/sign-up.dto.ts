import { IsEmail, MinLength, IsOptional, IsString } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  @IsOptional()
  displayName?: string;
}
