import { IsString, Matches } from 'class-validator';

export class UpdatePhoneDto {
  @IsString()
  @Matches(/^\+?[1-9]\d{7,14}$/, {
    message: 'Invalid phone number format. Example: +48123456789',
  })
  phoneNumber!: string;
}
