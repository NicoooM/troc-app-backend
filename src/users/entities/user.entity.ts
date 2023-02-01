import { ItemEntity } from 'src/items/entities/item.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  createdAt: Date;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  city: string;

  @Column()
  postalCode: number;

  @OneToMany(() => ItemEntity, (item) => item.user, { nullable: true })
  items: ItemEntity[];
}
