import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdatePushTokenDto {
  @IsOptional()
  @IsString()
  pushToken?: string;

  @IsOptional()
  @IsBoolean()
  notificationsEnabled?: boolean;
}
