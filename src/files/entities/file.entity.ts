import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { CommonEntity } from '../../common.entity';

@Entity()
export class File extends CommonEntity {
  @Column()
  url: string;

  @Column()
  key: string;

  @Column()
  eTag: string;

  @Column({ name: 'post_id', nullable: true })
  postId?: number;

  @ManyToOne(() => Post, (post) => post.files)
  @JoinColumn({ name: 'post_id' })
  post: Post;
}
