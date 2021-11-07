import * as fs from 'fs';
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { PostsService } from '../posts/posts.service';
import { CreatePostDto } from '../posts/dto/create-post.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as dayjs from 'dayjs';
import { FilesService } from '../files/files.service';
import { S3 } from 'aws-sdk';
import { Post } from '../posts/entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WingmanService {
  constructor(
    private usersService: UsersService,
    private postsService: PostsService,
    private filesService: FilesService,
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
  ) {}
  private readonly logger = new Logger(WingmanService.name);

  @Cron(CronExpression.EVERY_HOUR)
  async crawlInstizFreeBoard() {
    this.logger.debug(
      `crawlInstizFreeBoard started ${WingmanService.name} ${Date.now()}`,
    );
    const listUrl = 'https://www.instiz.net/name?category=1';
    const html = await this.getHtml(listUrl);
    const posts = await this.getPostsValues(html);
    // TODO temp
    await this.createPostsByWingman(posts);
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
    const categories = ['free', 'exercise', 'environment', 'meetup'];
    const users: User[] = await this.usersService.findWingmanUsers();
    const wingman: User = users[Math.floor(Math.random() * users.length)];
    await Promise.all(
      posts.map(async (post) => {
        const dto: CreatePostDto = {
          ...post,
          poster: wingman.id.toString(),
          category: categories[Math.floor(Math.random() * categories.length)],
        };
        const createdPost = await this.postsService.createPostByWingman(dto);

        if (post.src) {
          await this.uploadImage(createdPost, post.src);
        }

        return createdPost;
      }),
    );
  }
  async uploadImage(createdPost: Post, url) {
    const path = 'wingmantest' + dayjs().valueOf().toString() + '.jpg';
    await axios({
      url,
      responseType: 'stream',
    }).then((res) => {
      return new Promise((resolve, reject) => {
        res.data
          .pipe(fs.createWriteStream(path))
          .on('finish', (r) => resolve(r))
          .on('error', (e) => reject(e));
      });
    });
    // TODO remove
    const s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: 'ap-northeast-2',
    });
    fs.readFile(path, async (err, data) => {
      if (err) {
        fs.unlinkSync(path);
        throw new Error();
      }
      const params = {
        Bucket: 'movement-seoul',
        Key: path,
        Body: data,
        ContentType: 'image/jpeg',
      };
      const { Location, ETag, Key } = await s3.upload(params).promise();
      fs.unlinkSync(path);
      const uploadFileDto = {
        url: Location,
        eTag: ETag,
        key: Key,
        size: 0,
        type: 'jpg',
      };
      const file = await this.filesService.createFile(uploadFileDto);
      if (file) {
        createdPost.files = [file];
        await this.postRepo.save(createdPost);
      }
    });
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
