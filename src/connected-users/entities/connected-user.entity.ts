import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';

@Entity('connected-user')
export class ConnectedUserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  socketId: string;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;
}
