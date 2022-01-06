import { Entity, Column } from 'typeorm';
import { CommonEntity } from '../../common.entity';

@Entity()
export class Category extends CommonEntity {
  @Column()
  type: 'board';
  @Column({ unique: true })
  title: string;
}
