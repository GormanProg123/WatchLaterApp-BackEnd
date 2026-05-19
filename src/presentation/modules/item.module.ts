import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from 'src/infrastructure/database/schemas/item.entity';
import { ItemsUseCases } from 'src/applications/usecases/items.usecases';
import { ItemController } from 'src/presentation/controllers/item.controller';
import { AuthModule } from 'src/presentation/modules/auth.module';
import { ThumbnailService } from 'src/infrastructure/services/thumbnail.service';
import { CleanupService } from 'src/infrastructure/services/cleanup.service';
import { NotificationModule } from 'src/presentation/modules/notification.module';
import { User } from 'src/infrastructure/database/schemas/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item, User]),
    AuthModule,
    NotificationModule,
  ],
  controllers: [ItemController],
  providers: [ItemsUseCases, ThumbnailService, CleanupService],
})
export class ItemsModule {}
