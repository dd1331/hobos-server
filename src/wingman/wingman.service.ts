import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { UsersService } from '../users/users.service';
import { PostsService } from '../posts/posts.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as dayjs from 'dayjs';
import { FilesService } from '../files/files.service';
import { Post } from '../posts/entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../common/entities/category.entity';

@Injectable()
export class WingmanService {
  constructor(
    private usersService: UsersService,
    private postsService: PostsService,
    private filesService: FilesService,
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}
  private readonly logger = new Logger(WingmanService.name);

  @Cron(CronExpression.EVERY_30_MINUTES)
  async crawlInstizFreeBoard() {
    try {
      this.logger.debug(
        `crawlInstizFreeBoard started ${WingmanService.name} ${Date.now()}`,
      );
      const listUrl = 'https://www.instiz.net/name?category=1';
      const html = await this.getHtml(listUrl);
      const posts = await this.getPostsValues(html);
      // TODO temp
      await this.createPostsByWingman(posts);
    } catch (error) {
      console.log('WingmanService -> crawlInstizFreeBoard -> error', error);
    }
  }

  private async getPostsValues(html) {
    const $ = cheerio.load(html.data);
    const $bodyList = $('#mainboard').children().children();
    const urlList = this.getUrlList($, $bodyList);

    return await Promise.all(
      urlList.map(async (url) => {
        const html = await this.getHtml(url);
        const $ = cheerio.load(html.data);
        const title = $('.tb_top').find('#nowsubject a').text().trim();
        const content = $('.memo_content');
        const contentStr = content.text().trim();
        let src = '';
        $('.memo_content')
          .find('p')
          .each((index, e) => {
            if (index >= 1) return;

            if ($(e).find('img').attr('src'))
              src = $(e).find('img').attr('src');
          });
        const result = { title, content: contentStr, src };

        return result;
      }),
    );
  }

  private async createPostsByWingman(
    posts: { title: string; content: string; src?: string }[],
  ) {
    const categories = await this.categoryRepo.find();
    const wingmans = await this.usersService.findWingmanUsers();
    const random = Math.floor(Math.random() * wingmans.length);
    const poster = wingmans[random].id;
    await Promise.all(
      posts.map(async (post) => {
        const random = Math.floor(Math.random() * categories.length);
        const category = categories[random].title;
        const dto = {
          ...post,
          poster,
          category,
        };
        const createdPost = await this.postsService.createPostByWingman(dto);

        if (post.src) {
          this.uploadImage(createdPost, post.src);
        }

        return createdPost;
      }),
    );
  }
  async uploadImage(createdPost: Post, url) {
    return axios
      .get(url, { responseType: 'arraybuffer' })
      .then(async (response) => {
        const path = 'wingman' + dayjs().valueOf().toString() + '.jpg';
        const ContentLength = response.data.length.toString(); // or response.header["content-length"] if available for the type of file downloaded
        const params = {
          ContentType: response.headers['content-type'],
          ContentLength,
          Bucket: 'hobos',
          Body: response.data,
          Key: path,
        };
        const { Location, ETag, Key } = await this.filesService.uploadS3(
          params,
        );
        const uploadFileDto = {
          url: Location,
          eTag: ETag,
          key: Key,
          size: ContentLength,
          type: 'jpg',
        };
        const file = await this.filesService.createFile(uploadFileDto);
        if (file) {
          createdPost.files = [file];
          await this.postRepo.save(createdPost);
        }
      })
      .catch((err) => console.log('WingmanService -> uploadImage -> err'));
  }
  getUrlList($, $bodyList) {
    const urlPrefix = 'https://www.instiz.net';
    const urlList = [];

    $bodyList.each((i, elem) => {
      try {
        const isLocked = $(elem).find('.listsubject .minitext').html();
        const url =
          urlPrefix + $(elem).find('.listsubject a').attr('href').slice(2);

        if (!isLocked) urlList.push(url);
      } catch (error) {}
    });

    return urlList;
  }
  async getHtml(url) {
    try {
      return await axios.get(url);
    } catch (error) {}
  }
}
