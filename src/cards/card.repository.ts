import { Repository, EntityRepository } from 'typeorm';
import { Card } from './card.entity';

@EntityRepository(Card)
export class CardRepository extends Repository<Card> {
  public async limit(limit: number) {
    return this.createQueryBuilder('card')
      .limit(limit)
      .getMany();
  }
  public async paginate(skip: number, limit: number) {
    return this.createQueryBuilder('card')
      .skip(skip)
      .limit(limit)
      .getMany();
  }
  public async search(term: string) {
    return this.createQueryBuilder('card')
      .andWhere(`card.title LIKE :term`, { term: `%${term}%` })
      .leftJoinAndSelect('card.section', 'section')
      .getMany();
  }
}
