import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	ParseIntPipe,
	Post,
	Put,
	Query,
	UseGuards,
	ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { UserDecorator } from '../auth/user.decorator.ts';
import { User } from '../auth/user.entity.ts';
import { PaginationDTO } from '../sections/section.dto.ts';
import { CreateCardDTO, UpdateCardDTO } from './card.dto.ts';
import { Card } from './card.entity.ts';
import { CardsService } from './cards.service.ts';

@Controller('cards')
@ApiTags('Cards')
export class CardsController {
	constructor(private readonly cardsService: CardsService) {}

	@Get()
	paginateSections(
		@Query() pagination: PaginationDTO,
		@Query('search') search: string,
		@Query('limit') limit: string,
	): Promise<Card[]> {
		if (search) {
			return this.cardsService.searchSection(search);
		}
		if (pagination.take && pagination.skip) {
			const { skip, take } = pagination;
			return this.cardsService.paginate(skip, take);
		}
		if (limit) {
			return this.cardsService.findAllWithLimit(+limit);
		}
		return this.cardsService.findAllCards();
	}
	@Get(':id')
	getCardById(@Param('id', ParseIntPipe) id: number): Promise<Card> {
		return this.cardsService.findOne(id);
	}
	@Post(':sectionId')
	@HttpCode(201)
	@ApiBody({ type: [CreateCardDTO] })
	@UseGuards(AuthGuard('jwt'))
	createCard(
		@Param('sectionId', ParseIntPipe) sectionId: number,
		@Body(ValidationPipe) cardData: CreateCardDTO,
		@UserDecorator() user: User,
	) {
		return this.cardsService.create(sectionId, cardData, user);
	}
	@Put(':sectionId/card/:cardId')
	@ApiBody({ type: [UpdateCardDTO] })
	@UseGuards(AuthGuard('jwt'))
	updateCard(
		@Param('sectionId', ParseIntPipe) sectionId: number,
		@Param('cardId', ParseIntPipe) cardId: number,
		@Body(ValidationPipe) cardData: UpdateCardDTO,
		@UserDecorator() user: User,
	) {
		return this.cardsService.update(sectionId, cardId, cardData, user);
	}
	@Delete(':sectionId/card/:cardId')
	@HttpCode(204)
	@UseGuards(AuthGuard('jwt'))
	deleteCard(
		@Param('sectionId', ParseIntPipe) sectionId: number,
		@Param('cardId') cardId: number,
		@UserDecorator() user: User,
	): Promise<void> {
		return this.cardsService.remove(sectionId, cardId, user);
	}
}
