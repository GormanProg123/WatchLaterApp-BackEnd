import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @Matches(/^\+?[1-9]\d{7,14}$/, {
    message: 'Invalid phone number format. Example: +48123456789',
  })
  phoneNumber!: string;

  @IsString()
  @MinLength(8)
  newPassword!: string;

  @IsString()
  code!: string;
}
