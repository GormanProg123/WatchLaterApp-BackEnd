import {
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  IsDateString,
} from 'class-validator';
import {
  Platform,
  ItemStatus,
} from 'src/infrastructure/database/schemas/item.entity';

export class CreateItemDto {
  @IsUrl()
  url!: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(Platform)
  @IsOptional()
  platform?: Platform;

  @IsEnum(ItemStatus)
  @IsOptional()
  status?: ItemStatus;

  @IsDateString()
  @IsOptional()
  remindAt?: string;
}
