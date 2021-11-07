import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './room.entity';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MatcherService {
  constructor(
    @InjectRepository(Room) private readonly roomRepo: Repository<Room>,
    @InjectRepository(Chat) private readonly chatRepo: Repository<Chat>,
  ) {}

  async getRoomOrCreate(topic): Promise<Room> {
    try {
      const room: Room = await this.roomRepo.findOneOrFail({
        where: { topic },
      });
      if (room) return room;
    } catch (error) {
      const room: Room = await this.roomRepo.create({ topic });
      await this.roomRepo.save(room);
      return room;
    }
  }
  async getRoomOrFail(roomId: string): Promise<Room> {
    const room = await this.roomRepo.findOne(roomId);

    if (!room) throw new HttpException('room not found', HttpStatus.NOT_FOUND);

    return room;
  }
  async sendChat(data): Promise<Chat> {
    const { roomId, user, message } = data;
    const room = await this.getRoomOrFail(roomId);
    const chat = await this.createChat({ room, user, message });
    return chat;
  }

  async createChat(data: {
    message: string;
    user: User;
    room: Room;
  }): Promise<Chat> {
    const { message, user, room } = data;
    const chat = await this.chatRepo.create({
      message,
      userId: user.id,
      userName: user.userName,
      roomId: room.id,
    });
    return await chat.save();
  }

  async getChatByRoomId(roomId): Promise<Chat[]> {
    const chat = await this.chatRepo.find({
      where: { roomId },
      take: 50,
      order: { createdAt: 'DESC' },
    });
    return chat;
  }
}
