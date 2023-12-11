import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/auth/user.entity';
import { Card } from 'src/cards/card.entity';
import { BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
		(type) => Card,
		(card) => card.section,
	)
	cards: Card[];

	@ApiProperty()
	@ManyToMany(
		(type) => User,
		(user) => user.sections,
		{ onDelete: 'CASCADE' },
	)
	users: User[];
}
