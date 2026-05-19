import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { User } from 'src/infrastructure/database/schemas/user.entity';
import { Tag } from './tag.entity';
import { Reminder } from './reminder.entity';

export enum Platform {
  YOUTUBE = 'youtube',
  MOVIES = 'movies',
  SERIES = 'series',
  OTHER = 'other',
}

export enum ItemStatus {
  WANT = 'want',
  WATCHING = 'watching',
  DONE = 'done',
}

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', nullable: true })
  url!: string;

  @Column({ type: 'varchar', nullable: true })
  thumbnailUrl?: string;

  @Column({ type: 'varchar', nullable: true })
  title?: string;

  @Column({ type: 'varchar', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: Platform, default: Platform.OTHER })
  platform!: Platform;

  @Column({ type: 'enum', enum: ItemStatus, default: ItemStatus.WANT })
  status!: ItemStatus;

  @Column({ type: 'timestamptz', nullable: true })
  remindAt?: Date;

  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, (user) => user.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @OneToMany(() => Reminder, (reminder) => reminder.item)
  reminders?: Reminder[];

  @ManyToMany(() => Tag, (tag) => tag.items)
  @JoinTable({
    name: 'item_tags',
    joinColumn: { name: 'item_id' },
    inverseJoinColumn: { name: 'tag_id' },
  })
  tags?: Tag[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  deletedAt?: Date;
}
