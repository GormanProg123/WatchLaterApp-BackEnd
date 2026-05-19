import { IsString, IsEmail } from 'class-validator';

export class UpdateEmailDto {
  @IsString()
  
  @IsEmail()
  email!: string;
}
