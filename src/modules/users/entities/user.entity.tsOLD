// Pourpase: Entity for the user table
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, nullable: false })
  name: string;

  @Column({ length: 50, nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ type: 'bigint' })
  phone?: number;

  @Column({ length: 50 })
  country?: string;

  @Column()
  address?: string;

  @CreateDateColumn()
  birthday?: Date;

  @Column({ length: 50 })
  city?: string;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  createdAt: Date;

  @Column({ default: false })
  isAdmin: boolean;
}
