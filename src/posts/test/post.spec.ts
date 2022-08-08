import { Post } from '../entities/post.entity';

describe('Post', () => {
  describe('', () => {
    it('게시글을 읽으면 뷰 + 1', () => {
      const post = new Post();
      const views = 10;
      post.views = views;
      post.read();
      expect(post.views).toBe(views + 1);
    });
  });
});
