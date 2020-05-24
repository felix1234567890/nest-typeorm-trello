import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardRepository } from './card.repository';
import { SectionRepository } from 'src/sections/section.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CardRepository, SectionRepository])],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}
