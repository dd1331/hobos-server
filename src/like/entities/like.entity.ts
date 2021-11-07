import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CommonEntity } from '../../common.entity';
import { Post } from '../../posts/entities/post.entity';
import { User } from '../../users/entities/user.entity';
import { ChildComment } from '../../comments/entities/child_comment.entity';
import { Comment } from '../../comments/entities/comment.entity';

@Entity()
export class Like extends CommonEntity {
  @Column()
  type: string;

  @Column({ nullable: true })
  isLike: boolean;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => Post, (post) => post.likes)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => Comment, (comment) => comment.likes)
  @JoinColumn({ name: 'comment_id' })
  comment: Comment;

  @ManyToOne(() => ChildComment, (childComment) => childComment.likes)
  @JoinColumn({ name: 'child_comment_id' })
  childComment: ChildComment;

  @ManyToOne(() => User, (user) => user.likes)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
