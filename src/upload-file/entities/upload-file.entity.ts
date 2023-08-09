import { TimestampEntity } from 'src/Generic/timestamp.entity';
import { ItemEntity } from 'src/items/entities/item.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('upload-file')
export class UploadFileEntity extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  ETag: string;

  @Column()
  Location: string;

  @Column({
    nullable: true,
  })
  key: string;

  @Column({
    nullable: true,
  })
  Key: string;

  @Column({
    nullable: true,
  })
  Bucket: string;

  @ManyToOne(() => ItemEntity, (item) => item.files, {
    nullable: true,
  })
  item: ItemEntity;
}
