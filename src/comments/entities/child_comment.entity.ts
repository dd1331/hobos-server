import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';
import { CommonEntity } from '../../common.entity';
import { Like } from '../../like/entities/like.entity';
@Entity()
export class ChildComment extends CommonEntity {
  @Column()
  content: string;

  @Column({ default: 0, nullable: true, name: 'like_count' })
  likeCount: number;

  @Column({ default: 0, nullable: true, name: 'dislike_count' })
  dislikeCount: number;

  @Column({ name: 'post_id' })
  postId: number;

  @ManyToOne(() => User, (user) => user.comments)
  commenter: User;

  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @OneToMany(() => Like, (like) => like.childComment)
  likes: Like[];

  @Column()
  parentId: number;
}
