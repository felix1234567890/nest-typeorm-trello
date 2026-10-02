import {
	BaseEntity,
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	type Relation,
} from 'typeorm';
import { Section } from '../sections/section.entity.ts';

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
		(type) => Section,
		(section) => section.cards,
		{ eager: false, onDelete: 'CASCADE' },
	)
	@JoinColumn({ name: 'section_id' })
	section: Relation<Section>;
}
