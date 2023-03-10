import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';

@Entity('reset-password-token')
export class ResetPasswordTokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  token: string;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;
}
