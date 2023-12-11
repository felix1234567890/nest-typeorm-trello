import { Module } from '@nestjs/common';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { SectionsModule } from 'src/sections/sections.module';
import { DataSource, Repository } from 'typeorm';
import { Card } from './card.entity';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';

export interface CardRepository extends Repository<Card> {
	this: Repository<Card>;
	limit(limit: number): Promise<any>;
	paginate(skip: number, limit: number): Promise<any>;
	search(term: string): Promise<any>;
}
const cardRepository = {
	provide: getRepositoryToken(Card),
	useFactory: (dataSource: DataSource) =>
		dataSource.getRepository(Card).extend({
			async limit(limit: number) {
				return this.createQueryBuilder('card').limit(limit).getMany();
			},
			async paginate(skip: number, limit: number) {
				return this.createQueryBuilder('card').skip(skip).limit(limit).getMany();
			},
			async search(term: string) {
				return this.createQueryBuilder('card')
					.andWhere(`card.title LIKE :term`, { term: `%${term}%` })
					.leftJoinAndSelect('card.section', 'section')
					.getMany();
			},
		}),
	inject: [getDataSourceToken()],
};
@Module({
	imports: [SectionsModule],
	controllers: [CardsController],
	providers: [CardsService, cardRepository],
})
export class CardsModule {}
