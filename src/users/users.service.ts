import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcript from 'bcryptjs';
import { Repository } from 'typeorm';
import { CommentsService } from '../comments/comments.service';
import { LikesService } from '../like/likes.service';
import { PostsService } from '../posts/posts.service';
import { CreateUserNaverDto } from './dto/create-user-naver.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleEnum, User } from './entities/user.entity';
import { Profile } from './users.type';

const randomWords = () => new Date().valueOf().toString();
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
    private readonly likesService: LikesService,
  ) {}
  async create(dto: CreateUserDto): Promise<User> {
    await this.checkDuplication(dto);

    dto.password = await bcript.hash(dto.password, 12);
    dto.userId = randomWords() + 'ID';
    dto.userName = randomWords() + 'NAME';

    const newUser = this.userRepo.create(dto);
    return this.userRepo.save(newUser);
  }

  async createByNaverId(dto: CreateUserNaverDto): Promise<User> {
    const password = randomWords();
    return this.create({ ...dto, password });
  }
  async checkDuplication({ phone }: CreateUserDto): Promise<boolean> {
    const isExisting = await this.userRepo.findOne({ where: { phone } });

    if (isExisting) throw new ConflictException('이미 존재하는 번호입니다');

    return true;
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  async findWingmanUsers(): Promise<User[]> {
    const users = await this.userRepo.find({
      where: { role: RoleEnum.WINGMAN },
    });
    // TODO SEED database instead of hard coding
    if (users.length === 0) {
      const dto: CreateUserDto = {
        phone: '01099999998',
        userName: 'test',
        password: '1331',
        role: RoleEnum.WINGMAN,
      };
      users.push(await this.create(dto));
    }

    return users;
  }

  async findAllWithDeleted(): Promise<User[]> {
    return this.userRepo.find({ withDeleted: true });
  }

  async getUserByIdOrFail(id: number): Promise<User> {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException('user not found');
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
  async getUserByNaverId(naverId: string) {
    return this.userRepo.findOne({ where: { naverId } });
  }
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.getUserByIdOrFail(id);

    await this.userRepo.update(id, updateUserDto);

    const updatedUser = await this.userRepo.findOne({
      where: { id },
      withDeleted: true,
    });

    return updatedUser;
  }
  async remove(id: number): Promise<User> {
    await this.getUserByIdOrFail(id);

    await this.userRepo.softDelete(id);

    const deletedUser = await this.userRepo.findOne({
      where: { id },
      withDeleted: true,
    });

    return deletedUser;
  }
  async hardRemove(id: number): Promise<boolean> {
    await this.userRepo.delete(id);

    return true;
  }
}
