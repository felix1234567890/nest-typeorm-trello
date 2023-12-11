import { Module } from '@nestjs/common';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { DataSource, Repository } from 'typeorm';
import { Section } from './section.entity';
import { SectionsController } from './sections.controller';
import { SectionsService } from './sections.service';

export interface SectionRepository extends Repository<Section> {
	this: Repository<Section>;
	limit(resource: string, limit: number): Promise<any>;
	paginate(resource: string, skip: number, limit: number): Promise<any>;
	search(resource: string, term: string): Promise<any>;
}
const sectionRepository = {
	provide: getRepositoryToken(Section),
	useFactory: (dataSource: DataSource) =>
		dataSource.getRepository(Section).extend({
			async limit(resource: string, limit: number) {
				return this.createQueryBuilder(resource).limit(limit).getMany();
			},
			async paginate(resource: string, skip: number, limit: number) {
				return this.createQueryBuilder(resource).skip(skip).limit(limit).getMany();
			},
			async search(resource: string, term: string) {
				return this.createQueryBuilder(resource)
					.andWhere(`${resource}.title LIKE :term`, { term: `%${term}%` })
					.getMany();
			},
		}),
	inject: [getDataSourceToken()],
};
@Module({
	imports: [AuthModule],
	controllers: [SectionsController],
	providers: [SectionsService, sectionRepository],
	exports: [sectionRepository],
})
export class SectionsModule {}
