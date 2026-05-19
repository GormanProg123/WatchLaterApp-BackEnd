import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import {
  Item,
  ItemStatus,
} from 'src/infrastructure/database/schemas/item.entity';
import { CreateItemDto } from 'src/domain/dto/create-item.dto';
import { ThumbnailService } from 'src/infrastructure/services/thumbnail.service';
import { NotificationService } from 'src/infrastructure/services/notification.service';
import { User } from 'src/infrastructure/database/schemas/user.entity';

@Injectable()
export class ItemsUseCases {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    private readonly thumbnailService: ThumbnailService,
    private readonly notificationService: NotificationService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userId: string, dto: CreateItemDto): Promise<Item> {
    const thumbnailUrl = await this.thumbnailService.getThumbnail(dto.url);

    const item = this.itemRepository.create({
      ...dto,
      userId,
      thumbnailUrl: thumbnailUrl ?? undefined,
    });
    const saved = await this.itemRepository.save(item);

    await this.notificationService.scheduleReminderForItem(saved);

    return saved;
  }

  async findAll(userId: string): Promise<Item[]> {
    return this.itemRepository.find({
      where: { userId, deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(userId: string, itemId: string): Promise<Item> {
    const item = await this.itemRepository.findOne({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    if (item.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return item;
  }

  async updateStatus(
    userId: string,
    itemId: string,
    status: ItemStatus,
  ): Promise<Item> {
    const item = await this.findOne(userId, itemId);
    item.status = status;
    return this.itemRepository.save(item);
  }

  async findTrash(userId: string): Promise<Item[]> {
    return this.itemRepository.find({
      where: { userId, deletedAt: Not(IsNull()) },
      order: { deletedAt: 'DESC' },
    });
  }

  async restoreFromTrash(userId: string, itemId: string): Promise<Item> {
    const item = await this.findOne(userId, itemId);
    item.deletedAt = undefined;
    item.remindAt = undefined;
    return this.itemRepository.save(item);
  }

  async toggleNotifications(userId: string, enabled: boolean) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) throw new UnauthorizedException();

    user.notificationsEnabled = enabled;
    await this.userRepository.save(user);

    return { success: true };
  }

  async updatePushToken(userId: string, token: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) throw new UnauthorizedException();

    user.pushToken = token;
    await this.userRepository.save(user);

    return { success: true };
  }

  async delete(userId: string, itemId: string): Promise<void> {
    const item = await this.findOne(userId, itemId);
    await this.itemRepository.remove(item);
  }
}
