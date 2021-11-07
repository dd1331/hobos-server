import { User } from './entities/user.entity';

export type BulkedUser = Partial<User> & { accessToken: string };

export type Profile = {
  postSum: number;
  commentSum: number;
  likeSum: number;
  dislikeSum: number;
};
