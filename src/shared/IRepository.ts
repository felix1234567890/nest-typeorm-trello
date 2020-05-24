import { Section } from '../sections/section.entity';
import { Card } from 'src/cards/card.entity';

type Data = Section[] | Card[];
export interface IRepository {
  limit(resource: string, limit: number): Promise<Data>;
  paginate(resource: string, skip: number, limit: number): Promise<Data>;
  search(resource: string, term: string): Promise<Data>;
}
