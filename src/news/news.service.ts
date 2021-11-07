import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { NewsDto } from './dto/news-dto';
// import { CacheService } from '../cache/cache.service';
import * as Parser from 'rss-parser';
import * as dayjs from 'dayjs';

@Injectable()
export class NewsService {
  // constructor(private cacheService: CacheService) {}
  async findAll(): Promise<NewsDto[]> {
    // const cachedNews: NewsDto[] = await this.cacheService.get('news');

    // if (cachedNews) return cachedNews;

    const parser = new Parser();
    const feed = await parser.parseURL(
      'https://news.sbs.co.kr/news/SectionRssFeed.do?sectionId=08&plink=RSSREADER',
    );
    const news: NewsDto[] = [];
    feed.items.map((item) => {
      news.push({
        title: item.title,
        image: item.enclosure.url,
        summary: item.author,
        writer: item.author,
        writtenAt: dayjs(item.isoDate).toDate(),
        url: item.link,
      });
    });
    // await this.cacheService.set('news', news);

    return news;
  }

  async _findAll(): Promise<NewsDto[]> {
    // const cachedNews: NewsDto[] = await this.cacheService.get('news');

    // if (cachedNews) return cachedNews;

    const news: NewsDto[] = [];
    const html = await this.getHtml();
    const $ = cheerio.load(html.data);
    const $bodyList = $('section.article-list-content').children(
      'div.list-block',
    );
    const imageUrls = [];
    const urlPrefix = 'http://www.newspenguin.com/news';
    await $bodyList.each(async (i, elem) => {
      if (i > 1) return;

      const imageArray = $(elem).find('.list-image').attr('style').split('(.');
      imageArray[0] = urlPrefix;
      imageArray[1] = imageArray[1].slice(0, -1);
      const image = imageArray.join('');

      if (image) imageUrls.push(image);

      const newsInfoArray = $(elem)
        .find('.list-dated')
        .text()
        .trim()
        .split(' | ');
      const url =
        urlPrefix.replace('/news', '') +
        $(elem).find('.list-titles a').attr('href').trim();
      news[i] = {
        title: $(elem).find('strong').text(),
        image,
        summary: $(elem).find('.list-summary a').text().trim(),
        writer: newsInfoArray[1],
        writtenAt: new Date(newsInfoArray[2]),
        url,
      };
    });
    // await this.cacheService.set('news', news);

    return news;
  }
  async getHtml() {
    try {
      return await axios.get(
        'http://www.newspenguin.com/news/articleList.html?view_type=sm',
      );
    } catch (error) {
      console.error(error);
    }
  }
}
