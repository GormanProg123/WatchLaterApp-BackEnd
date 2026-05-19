import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, IsNull, Not } from 'typeorm';
import { Item } from 'src/infrastructure/database/schemas/item.entity';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async moveExpiredToTrash() {
    const now = new Date();

    const expired = await this.itemRepository.find({
      where: {
        remindAt: LessThan(now),
        deletedAt: IsNull(),
      },
    });

    if (expired.length === 0) return;

    for (const item of expired) {
      item.deletedAt = now;
    }

    await this.itemRepository.save(expired);
    this.logger.log(`Moved ${expired.length} expired items to trash`);
  }

  @Cron(CronExpression.EVERY_HOUR)
  async deleteOldTrash() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const result = await this.itemRepository.delete({
      deletedAt: LessThan(sevenDaysAgo),
    });

    if (result.affected && result.affected > 0) {
      this.logger.log(
        `Permanently deleted ${result.affected} items from trash`,
      );
    }
  }
}
