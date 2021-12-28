import { Entity, ManyToOne, JoinColumn, Column } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CommonEntity } from '../../common.entity';

@Entity()
export class Review extends CommonEntity {
  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: false })
  reviewId: number;

  @Column()
  type: 'local' | 'cafe';
}
