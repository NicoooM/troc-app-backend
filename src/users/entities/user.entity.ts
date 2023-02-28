import { ItemEntity } from 'src/items/entities/item.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { TimestampEntity } from 'src/Generic/timestamp.entity';

@Entity('user')
export class UserEntity extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column()
  city: string;

  @Column()
  postalCode: number;

  @OneToMany(() => ItemEntity, (item) => item.user, { nullable: true })
  items: ItemEntity[];
}
