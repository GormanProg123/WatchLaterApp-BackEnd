import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Item } from './item.entity';
import { Tag } from './tag.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true })
  email!: string;

  @Column({ type: 'varchar' })
  passwordHash!: string;

  @Column({ type: 'varchar', nullable: true })
  displayName?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @OneToMany(() => Item, (item) => item.user)
  items?: Item[];

  @OneToMany(() => Tag, (tag) => tag.user)
  tags?: Tag[];

  @Column({ type: 'varchar', nullable: true })
  pushToken?: string;

  @Column({ type: 'boolean', default: false })
  notificationsEnabled!: boolean;

  @Column({ type: 'varchar', nullable: true })
  phoneNumber?: string;
}
