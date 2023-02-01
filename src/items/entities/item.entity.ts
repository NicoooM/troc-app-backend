import { UserEntity } from 'src/users/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('item')
export class ItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  createdAt: Date;

  @Column()
  description: string;

  @Column()
  isAvailable: boolean;

  @ManyToOne(() => UserEntity, (user) => user.items, { nullable: false })
  user: UserEntity;
}
