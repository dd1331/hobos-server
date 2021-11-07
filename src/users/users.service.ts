import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as randomWords from 'random-words';
import * as bcript from 'bcrypt';
import { PostsService } from '../posts/posts.service';
import { Profile } from './users.type';
import { CommentsService } from '../comments/comments.service';
import { LikesService } from '../like/likes.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
    private readonly likesService: LikesService,
  ) {}
  async create(dto: CreateUserDto): Promise<User> {
    await this.checkIfExist(dto);

    dto.password = await bcript.hash(dto.password, 12);
    dto.userId = randomWords() + 'ID';
    dto.userName = randomWords() + 'NAME';

    const newUser = await this.userRepo.create(dto);
    await this.userRepo.save(newUser);

    return newUser;
  }
  //temp any
  async checkIfExist(dto: CreateUserDto): Promise<boolean> {
    const { phone } = dto;
    const where = [{ phone }];
    const isExisting = await this.userRepo.findOne({ where });

    if (isExisting) {
      throw new HttpException('이미 존재하는 번호입니다', HttpStatus.CONFLICT);
    }

    return true;
  }

  async findAll(): Promise<User[]> {
    const users: User[] = await this.userRepo.find();

    return users;
  }

  async findWingmanUsers(): Promise<User[]> {
    const users: User[] = await this.userRepo.find({
      where: { role: 'wingman' },
    });
    // TODO SEED database instead of hard coding
    if (users.length === 0) {
      const dto: CreateUserDto = {
        phone: '01099999999',
        userName: 'test',
        password: '1331',
        role: 'wingman',
      };
      users.push(await this.create(dto));
    }

    return users;
  }

  async findAllWithDeleted(): Promise<User[]> {
    const users: User[] = await this.userRepo.find({ withDeleted: true });

    return users;
  }

  async getUserOrFail(id: number): Promise<User> {
    const user: User = await this.userRepo.findOne({
      where: { id },
    });

    if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

    return user;
  }

  async getProfile(id: number): Promise<Profile> {
    const postSum = await this.postsService.getPostSumByUserId(id);
    const commentSum = await this.commentsService.getCommentSumByUserId(id);
    const likeSum = await this.likesService.getLikeSumByUserId(id);
    const dislikeSum = await this.likesService.getDisLikeSumByUserId(id);
    const profile: Profile = {
      postSum,
      commentSum,
      likeSum,
      dislikeSum,
    };
    return profile;
  }

  async getUserByPhone(phone: string) {
    const user = await this.userRepo.findOne({ where: { phone } });

    if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

    return user;
  }
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.getUserOrFail(id);

    if (!user) return;

    await this.userRepo.update(id, updateUserDto);

    const updatedUser = await this.userRepo.findOne(id, { withDeleted: true });

    return updatedUser;
  }
  async remove(id: number): Promise<User> {
    const user: User = await this.userRepo.findOne(id);

    if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

    await this.userRepo.softDelete(id);

    const deletedUser = await this.userRepo.findOne(id, { withDeleted: true });

    return deletedUser;
  }
  async hardRemove(id: number): Promise<boolean> {
    await this.userRepo.delete(id);

    return true;
  }
}
