import { CommonEntity } from '../../common.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { PostHashtag } from '../../posts/entities/post_hashtag.entity';

@Entity()
export class Hashtag extends CommonEntity {
  @Column({ unique: true })
  title: string;

  @OneToMany(() => PostHashtag, (postHashtag) => postHashtag.post)
  postHashtags: PostHashtag[];
}
