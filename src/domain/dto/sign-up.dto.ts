import {
  IsEmail,
  MinLength,
  IsOptional,
  IsString,
  MaxLength,
  Matches,
} from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @MaxLength(64, { message: 'Password is too long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'Password must contain uppercase, lowercase letters and numbers',
  })
  password!: string;

  @IsString()
  @IsOptional()
  displayName?: string;
}
