import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, getRepository } from 'typeorm';
import { PostHashtag } from '../posts/entities/post_hashtag.entity';
import { CreatePostDto } from '../posts/dto/create-post.dto';
import { Post } from '../posts/entities/post.entity';
import { Hashtag } from './entities/hashtag.entity';
type HashtagIdOrTitle = string | number;

@Injectable()
export class HashtagsService {
  constructor(
    @InjectRepository(Hashtag)
    private readonly hashtagRepo: Repository<Hashtag>,
    @InjectRepository(PostHashtag)
    private readonly postHashtagRepo: Repository<PostHashtag>,
  ) {}
  async create(newPost: Post, dto: CreatePostDto) {
    const strHashtags: string[] = dto.hashtags;

    try {
      await Promise.all(
        strHashtags.map(async (strHashtag) => {
          const hashtag = await this.hashtagRepo.create({ title: strHashtag });

          if (hashtag) await this.hashtagRepo.save(hashtag);
        }),
      );
    } catch (error) {}
    const hashtags: Hashtag[] = await this.hashtagRepo.find({
      where: { title: In(dto.hashtags) },
    });

    const postHashtags: PostHashtag[] = await Promise.all(
      hashtags.map(async (hashtag) => {
        const postHashtag: PostHashtag = await this.postHashtagRepo.create();
        // TODO check circular error. it only works when it is saved by post
        postHashtag.post = newPost;
        postHashtag.hashtag = hashtag;
        await this.postHashtagRepo.save(postHashtag);

        return postHashtag;
      }),
    );

    return postHashtags;
  }

  async getPopularHashtags(): Promise<Hashtag[]> {
    const popularPostHashtags = await this.getCountsAndHashtagIds();
    const popularHashTags = [];
    // TODO check which is a better way of getting pupular hashtags either using IN funcion or separately
    await Promise.all(
      popularPostHashtags.map(async (postHashtag) => {
        const parsedPostHashtag = JSON.parse(JSON.stringify(postHashtag));
        const hashtag = await this.hashtagRepo.findOne(
          parsedPostHashtag.hashtagId,
        );
        popularHashTags.push(hashtag);
      }),
    );

    return popularHashTags;
  }
  async getCountsAndHashtagIds() {
    return await getRepository(PostHashtag)
      .createQueryBuilder('postHashtag')
      .select('COUNT(postHashtag.hashtag_id)', 'count')
      .addSelect('postHashtag.hashtag_id', 'hashtagId')
      // TODO apply where clause conditionally
      // .where('postHashtag.created_at Between :before and :after', {
      //   after: dayjs().toDate(),
      // })
      .groupBy('hashtag_id')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();
  }
  async getPostIdsByHashtag(
    hashtagIdOrTitle: HashtagIdOrTitle,
    column: string,
  ): Promise<number[]> {
    const postHastags: PostHashtag[] = await this.postHashtagRepo.find({
      where: { [column]: hashtagIdOrTitle },
    });
    const postIds = postHastags.map((postHastag) => postHastag.postId);

    return postIds;
  }
}
