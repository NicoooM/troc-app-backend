import { CategoryEntity } from 'src/categories/entities/category.entity';
import { TimestampEntity } from 'src/Generic/timestamp.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('message')
export class MessageEntity extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => UserEntity, (user) => user.sentMessages, { nullable: false })
  sender: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.receivedMessages, {
    nullable: false,
  })
  receiver: UserEntity;
}
