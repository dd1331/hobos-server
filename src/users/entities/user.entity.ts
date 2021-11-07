import { Entity, Column, OneToMany } from 'typeorm';
import { CommonEntity } from '../../common.entity';
import { Post } from '../../posts/entities/post.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Like } from '../../like/entities/like.entity';
import { ChildComment } from '../../comments/entities/child_comment.entity';
import { RoomLog } from '../../matcher/room_log.entity';
import { Chat } from '../../matcher/chat.entity';

@Entity()
export class User extends CommonEntity {
  @Column({ unique: true, name: 'user_id' })
  userId: string;

  @Column({ unique: true, name: 'naver_id', nullable: true })
  naverId: string;

  @Column({ unique: true, name: 'google_id', nullable: true })
  googleId: string;

  @Column({ unique: true, name: 'user_name' })
  userName: string;

  @Column()
  password: string;

  @Column({ unique: true, nullable: true })
  phone: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ default: 'normal' })
  provider: string;

  @Column({ nullable: true })
  avatar: string;

  @OneToMany(() => Post, (post) => post.poster)
  posts: [Post];

  @OneToMany(() => Comment, (comment) => comment.commenter)
  comments: [Comment];

  @OneToMany(() => ChildComment, (comment) => comment.commenter)
  childComments: [ChildComment];

  @OneToMany(() => Like, (like) => like.user)
  likes: [Like];

  @OneToMany(() => RoomLog, (roomLog) => roomLog.user)
  roomLog: [RoomLog];

  @OneToMany(() => Chat, (chat) => chat.userId)
  chat: [Chat];
}
