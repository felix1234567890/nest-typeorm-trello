import {
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  Entity,
} from 'typeorm';
import { Section } from 'src/sections/section.entity';

@Entity('cards')
export class Card extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  position: number;

  @ManyToOne(
    type => Section,
    section => section.cards,
    { eager: false, cascade: true, onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'section_id' })
  section: Section;
}
