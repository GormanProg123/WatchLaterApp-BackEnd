import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/infrastructure/database/schemas/user.entity';
import { Item } from 'src/infrastructure/database/schemas/item.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar', nullable: true })
  color?: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, (user) => user.tags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToMany(() => Item, (item) => item.tags)
  items?: Item[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
