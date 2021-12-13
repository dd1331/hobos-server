import { User, RoleEnum } from './entities/user.entity';

export type BulkedUser = Partial<User> & { accessToken: string };

export type SimpleUser = {
  userId: number;
  role: RoleEnum;
};
export type Profile = {
  postSum: number;
  commentSum: number;
  likeSum: number;
  dislikeSum: number;
};
