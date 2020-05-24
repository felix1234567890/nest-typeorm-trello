import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  BaseEntity,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Card } from 'src/cards/card.entity';
import { User } from 'src/auth/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('sections')
export class Section extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  label: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty()
  @Column()
  position: number;

  @ApiProperty()
  @OneToMany(
    type => Card,
    card => card.section,
  )
  cards: Card[];

  @ApiProperty()
  @ManyToMany(
    type => User,
    user => user.sections,
    { onDelete: 'CASCADE' },
  )
  users: User[];
}
