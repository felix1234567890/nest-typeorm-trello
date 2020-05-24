import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CardRepository } from './card.repository';
import { Card } from './card.entity';
import { NotFoundByIdException } from 'src/exceptions/NotFoundByIdException.exception';
import { CreateCardDTO, UpdateCardDTO } from './card.dto';
import { User } from 'src/auth/user.entity';
import { SectionRepository } from 'src/sections/section.repository';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(CardRepository)
    private readonly cardRepository: CardRepository,
    @InjectRepository(SectionRepository)
    private readonly sectionRepository: SectionRepository,
  ) {}
  async findAllCards(): Promise<Card[]> {
    try {
      return await this.cardRepository.find({
        order: { position: 'ASC' },
        relations: ['section'],
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async findAllWithLimit(limit: number): Promise<Card[]> {
    try {
      if (!isNaN(limit)) {
        return await this.cardRepository.find({
          order: { position: 'ASC' },
          take: limit,
          relations: ['section'],
        });
      } else {
        throw new BadRequestException('Limit should be an integer');
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async findOne(id: number): Promise<Card> {
    const card = await this.cardRepository.findOne(id, {
      relations: ['section'],
    });
    if (!card) throw new NotFoundByIdException('Card');
    return card;
  }
  async create(sectionId: number, data: CreateCardDTO, user: User) {
    const section = await this.sectionRepository.findOne(sectionId, {
      relations: ['users'],
    });
    if (!section)
      throw new BadRequestException(
        "Section for which you are creating a card doesn't exist",
      );
    if (section.users.length === 0)
      throw new UnauthorizedException(
        "You cannot create card for section you don't own",
      );
    const usersList = section.users.filter(usr => usr.id === user.id);
    if (usersList.length === 0)
      throw new UnauthorizedException(
        "You cannot create card for section you don't own",
      );
    const cardData = {
      ...data,
      section,
    };
    const card = await this.cardRepository.create(cardData);
    return this.cardRepository.save(card);
  }
  async update(
    sectionId: number,
    cardId: number,
    data: UpdateCardDTO,
    user: User,
  ) {
    const card = await this.cardRepository.findOne(cardId, {
      relations: ['section'],
    });
    if (!card) throw new NotFoundByIdException('Card');
    const section = await this.sectionRepository.findOne(sectionId, {
      relations: ['users'],
    });
    if (!section) throw new NotFoundByIdException('Section');
    if (card.section.id !== sectionId)
      throw new UnauthorizedException(
        "This card doesn't belong to given section",
      );
    if (!section.users)
      throw new BadRequestException(
        'You cannot change card that belongs to given section',
      );
    const usersList = section.users.filter(usr => usr.id === user.id);
    if (usersList.length === 0)
      throw new UnauthorizedException(
        "You canno't change card for section that you don't own",
      );
    const { title, description, position } = data;
    if (title) {
      card.title = title;
    }
    if (description) card.description = description;
    if (position) card.position = position;
    const updatedSection = await this.cardRepository.save(card);
    return updatedSection;
  }
  async remove(sectionId: number, cardId: number, user: User): Promise<void> {
    const card = await this.cardRepository.findOne(cardId, {
      relations: ['section'],
    });
    if (!card) throw new NotFoundByIdException('Card');
    const section = await this.sectionRepository.findOne(sectionId, {
      relations: ['users'],
    });
    if (!section) throw new NotFoundByIdException('Section');
    if (card.section.id !== sectionId)
      throw new UnauthorizedException(
        "This card doesn't belong to given section",
      );
    if (!section.users)
      throw new BadRequestException(
        'You can not delete card that belongs to given section',
      );
    const usersList = section.users.filter(usr => usr.id === user.id);
    if (usersList.length === 0)
      throw new UnauthorizedException(
        "You can not delete card for section that you don't own",
      );
    await card.remove();
  }
  async limit(limit: number) {
    await this.cardRepository.limit(limit);
  }
  async paginate(skip: number, limit: number) {
    const cards = await this.cardRepository.find({
      take: limit,
      skip,
      relations: ['section'],
    });
    if (cards.length === 0)
      throw new BadRequestException(
        'You entered parameters which are out of range',
      );
    return cards;
  }
  async searchSection(term: string) {
    return await this.cardRepository.search(term);
  }
}
