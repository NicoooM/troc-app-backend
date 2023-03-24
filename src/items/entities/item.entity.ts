import { CategoryEntity } from 'src/categories/entities/category.entity';
import { TimestampEntity } from 'src/Generic/timestamp.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { UploadFileEntity } from 'src/upload-file/entities/upload-file.entity';

@Entity('item')
export class ItemEntity extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    default: true,
  })
  isAvailable: boolean;

  @ManyToOne(() => UserEntity, (user) => user.items, { nullable: false })
  user: UserEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.items, {
    nullable: false,
  })
  category: CategoryEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.againstItems, {
    nullable: false,
  })
  againstCategory: CategoryEntity;

  @Column({ unique: true })
  slug: string;

  @OneToMany(() => UploadFileEntity, (uploadFile) => uploadFile.item, {
    nullable: true,
  })
  files: UploadFileEntity[];
}
