import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { CommonEntity } from '../common.entity';
import { User } from '../users/entities/user.entity';
import { Room } from './room.entity';

@Entity()
export class RoomLog extends CommonEntity {
  @ManyToOne(() => User, (user) => user.roomLog)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Room, (room) => room.roomLog)
  @JoinColumn({ name: 'room_id' })
  room: Room;
}
