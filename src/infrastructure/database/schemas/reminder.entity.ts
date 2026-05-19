import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Item } from 'src/infrastructure/database/schemas/item.entity';
import { User } from 'src/infrastructure/database/schemas/user.entity';

export enum ReminderChannel {
  EMAIL = 'email',
  PUSH = 'push',
  IN_APP = 'in_app',
}

@Entity('reminders')
export class Reminder {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  itemId!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'timestamptz' })
  remindAt!: Date;

  @Column({
    type: 'enum',
    enum: ReminderChannel,
    default: ReminderChannel.IN_APP,
  })
  channel!: ReminderChannel;

  @Column({ type: 'boolean', default: false })
  sent!: boolean;

  @ManyToOne(() => Item, (item) => item.reminders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'itemId' })
  item!: Item;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
