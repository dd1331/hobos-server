import { Entity, Column } from 'typeorm';
import { CommonEntity } from '../../common.entity';

@Entity()
export class Category extends CommonEntity {
  @Column()
  type: string;
  @Column()
  title: string;
}
