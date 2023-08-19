import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Section } from './section.entity';
import { CreateSectionDTO, UpdateSectionDTO } from './section.dto';
import { NotFoundByIdException } from 'src/exceptions/NotFoundByIdException.exception';
import { User } from 'src/auth/user.entity';
import { Repository } from 'typeorm';
import { SectionRepository } from './sections.module';

@Injectable()
export class SectionsService {
  constructor(
    @InjectRepository(Section)
    private sectionRepository: SectionRepository,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async findAllWithLimit(limit: number): Promise<Section[]> {
    try {
      if (!isNaN(limit)) {
        return await this.sectionRepository.find({
          order: { position: 'ASC' },
          take: limit,
          relations: ['users', 'cards'],
        });
      } else {
        throw new BadRequestException('Limit should be an integer');
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async findAll(): Promise<Section[]> {
    return await this.sectionRepository.find({ relations: ['users', 'cards'] });
  }
  async findOne(id: number): Promise<Section> {
    const section = await this.sectionRepository.findOne({
      where:{id},
      relations: ['users', 'cards'],
    });
    if (!section)
      throw new NotFoundException("Section with given ID doesn't exist");
    return section;
  }
  async create(data: CreateSectionDTO, user: User) {
    const section = await this.sectionRepository.create(data);
    await this.sectionRepository.save(section);
    const users = await this.userRepository.findByIds([user.id]);
    for (const usr of users) {
      usr.sections.push(section);
    }
    await this.userRepository.save(users);
  }
  async update(id: number, data: UpdateSectionDTO, user: User) {
    const section = await this.sectionRepository.findOne({
      where:{id},
      relations: ['users', 'cards'],
    });
    if (!section) throw new NotFoundByIdException('Section');
    if (section.users.length === 0)
      throw new UnauthorizedException(
        'You are not allowed to change this section',
      );
    const usersList = section.users.filter(usr => {
      return usr.id === user.id;
    });
    if (usersList.length === 0)
      throw new UnauthorizedException(
        'You are not allowed to change this section',
      );
    const { title, label, description, position } = data;
    if (title) {
      section.title = title;
    }
    if (label) section.label = label;
    if (description) section.description = description;
    if (position) section.position = position;
    const updatedSection = await this.sectionRepository.save(section);
    return updatedSection;
  }
  async remove(id: number, user: User): Promise<void> {
    const section = await this.sectionRepository.findOne({
      where:{id},
      relations: ['users', 'cards'],
    });
    if (!section) throw new NotFoundByIdException('Section');
    if (section.users.length === 0)
      throw new UnauthorizedException(
        'You are not allowed to delete this section',
      );
    const usersList = section.users.filter(usr => {
      return usr.id === user.id;
    });
    if (usersList.length === 0)
      throw new UnauthorizedException(
        'You are not allowed to delete this section',
      );
    await section.remove();
  }
  async limit(limit: number) {
    await this.sectionRepository.limit('sections', limit);
  }
  async paginate(skip: number, take: number) {
    const sections = await this.sectionRepository.find({
      take,
      skip,
      relations: ['users', 'cards'],
    });
    if (sections.length === 0)
      throw new BadRequestException(
        'You entered parameters which are out of range',
      );
    return sections;
  }
  async searchSection(term: string) {
    return await this.sectionRepository.search('sections', term);
  }
  async assign(id: number, user: User) {
    const section = await this.sectionRepository.findOne({
      where: {id},
      relations: ['users', 'cards'],
    });
    section.users.forEach(usr => {
      if (usr.id === user.id) {
        return;
      }
    });
    section.users.push(user);
    await this.sectionRepository.save(section);
  }
}
