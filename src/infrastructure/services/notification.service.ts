// src/infrastructure/services/notification.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, LessThanOrEqual } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import { Item } from '../database/schemas/item.entity';
import { Reminder, ReminderChannel } from '../database/schemas/reminder.entity';
import { User } from '../database/schemas/user.entity';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly expo = new Expo();

  constructor(
    @InjectRepository(Item)
    private readonly itemRepo: Repository<Item>,
    @InjectRepository(Reminder)
    private readonly reminderRepo: Repository<Reminder>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // Вызывается из ItemsUseCases.create() — создаёт reminder за 2 дня до remindAt
  async scheduleReminderForItem(item: Item): Promise<void> {
    if (!item.remindAt) return;

    const deadline = new Date(item.remindAt);

    const daysBefore = [3, 2, 1]; // можно менять

    for (const day of daysBefore) {
      const date = new Date(deadline.getTime() - day * 24 * 60 * 60 * 1000);

      // если дата уже прошла — пропускаем
      if (date < new Date()) continue;

      const exists = await this.reminderRepo.findOne({
        where: {
          itemId: item.id,
          remindAt: date,
        },
      });

      if (exists) continue;

      await this.reminderRepo.save(
        this.reminderRepo.create({
          itemId: item.id,
          userId: item.userId,
          remindAt: date,
          channel: ReminderChannel.PUSH,
          sent: false,
        }),
      );
    }
  }

  // Каждые 5 минут — отправляем накопленные напоминания
  @Cron('*/5 * * * *')
  async sendPendingReminders(): Promise<void> {
    const reminders = await this.reminderRepo.find({
      where: {
        sent: false,
        channel: ReminderChannel.PUSH,
        remindAt: LessThanOrEqual(new Date()),
      },
      relations: {
        item: true,
        user: true,
      },
    });

    if (!reminders.length) return;

    this.logger.log(`Sending ${reminders.length} pending reminders`);

    for (const reminder of reminders) {
      const user = reminder.user;

      if (
        !user?.pushToken ||
        !user.notificationsEnabled ||
        !Expo.isExpoPushToken(user.pushToken)
      ) {
        // Пользователь отключил уведомления — просто помечаем sent
        reminder.sent = true;
        await this.reminderRepo.save(reminder);
        continue;
      }

      const item = reminder.item;
      const deadline = item.remindAt
        ? new Date(item.remindAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })
        : null;

      const message: ExpoPushMessage = {
        to: user.pushToken,
        sound: 'default',
        title: '⏰ Watch reminder',
        body: deadline
          ? `"${item.title ?? 'Your video'}" — watch before ${deadline}`
          : `Don't forget to watch: ${item.title ?? 'your saved video'}`,
        data: { itemId: item.id },
      };

      try {
        const [ticket] = await this.expo.sendPushNotificationsAsync([message]);

        if (ticket.status === 'error') {
          this.logger.error(
            `Push error for item ${item.id}: ${ticket.message}`,
          );
        }

        reminder.sent = true;
        await this.reminderRepo.save(reminder);
        this.logger.log(
          `Sent push for item "${item.title}" to user ${user.id}`,
        );
      } catch (err) {
        this.logger.error(`Failed push for item ${item.id}`, err);
      }
    }
  }
}
