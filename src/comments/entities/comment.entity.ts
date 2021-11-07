import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CommonEntity } from '../../common.entity';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';
import { Like } from '../../like/entities/like.entity';

@Entity()
export class Comment extends CommonEntity {
  @Column()
  content: string;

  @Column({ default: 0, nullable: true, name: 'like_count' })
  likeCount: number;

  @Column({ default: 0, nullable: true, name: 'dislike_count' })
  dislikeCount: number;

  @Column({ default: 0, nullable: true, name: 'child_count' })
  childCount: number;

  @Column({ name: 'post_id' })
  postId: number;

  @ManyToOne(() => User, (user) => user.comments)
  commenter: User;

  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @OneToMany(() => Like, (like) => like.comment)
  likes: Like[];
}
