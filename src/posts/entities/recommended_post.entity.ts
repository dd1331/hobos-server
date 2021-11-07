import { Entity, Column } from 'typeorm';
import { CommonEntity } from '../../common.entity';

@Entity()
export class RecommendedPost extends CommonEntity {
  @Column({ unique: true, name: 'post_id' })
  postId: number;
}
