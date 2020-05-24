import { Repository, EntityRepository } from 'typeorm';
import { Section } from './section.entity';
import { IRepository } from '../shared/IRepository';

@EntityRepository(Section)
export class SectionRepository extends Repository<Section>
  implements IRepository {
  public async limit(resource: string, limit: number) {
    return this.createQueryBuilder(resource)
      .limit(limit)
      .getMany();
  }
  public async paginate(resource: string, skip: number, limit: number) {
    return this.createQueryBuilder(resource)
      .skip(skip)
      .limit(limit)
      .getMany();
  }
  public async search(resource: string, term: string) {
    return this.createQueryBuilder(resource)
      .andWhere(`${resource}.title LIKE :term`, { term: `%${term}%` })
      .getMany();
  }
}
