import { ItemEntity } from 'src/items/entities/item.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('category')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(() => ItemEntity, (item) => item.category, { nullable: true })
  items: ItemEntity[];

  @OneToMany(() => ItemEntity, (item) => item.againstCategory, {
    nullable: true,
  })
  againstItems: ItemEntity[];
}
