import { TimestampEntity } from 'src/Generic/timestamp.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('room')
export class RoomEntity extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, { nullable: false })
  firstUser: UserEntity;

  @ManyToOne(() => UserEntity, { nullable: false })
  secondUser: number | UserEntity;
}
