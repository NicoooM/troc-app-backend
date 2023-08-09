import { ItemEntity } from 'src/items/entities/item.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { TimestampEntity } from 'src/Generic/timestamp.entity';
import { MessageEntity } from 'src/messages/entities/message.entity';

@Entity('user')
export class UserEntity extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column({ select: false })
  password: string;

  @Column({
    nullable: true,
  })
  city: string;

  @Column({
    nullable: true,
  })
  postalCode: number;

  @OneToMany(() => ItemEntity, (item) => item.user, { nullable: true })
  items: ItemEntity[];

  @OneToMany(() => MessageEntity, (message) => message.sender, {
    nullable: true,
  })
  sentMessages: MessageEntity[];

  @OneToMany(() => MessageEntity, (message) => message.receiver, {
    nullable: true,
  })
  receivedMessages: MessageEntity[];
}
