import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Query,
  ValidationPipe,
  HttpCode,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { SectionsService } from './sections.service';
import {
  CreateSectionDTO,
  UpdateSectionDTO,
  PaginationDTO,
} from './section.dto';
import {
  ApiBody,
  ApiTags,
  ApiQuery,
  ApiCreatedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { Section } from './section.entity';
import { AuthGuard } from '@nestjs/passport';
import { UserDecorator } from 'src/auth/user.decorator';
import { User } from 'src/auth/user.entity';

@ApiTags('Sections')
@ApiBearerAuth()
@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionService: SectionsService) {}
  @Get()
  @ApiQuery({ name: 'pagination', type: PaginationDTO })
  paginateSections(
    @Query('search') search?: string,
    @Query('limit') limit?: number,
    @Query() pagination?: PaginationDTO,
  ): Promise<Section[]> {
    if (search) {
      return this.sectionService.searchSection(search);
    }
    if (pagination && pagination.take && pagination.skip) {
      const { skip, take } = pagination;
      return this.sectionService.paginate(skip, take);
    }
    if (limit) {
      return this.sectionService.findAllWithLimit(+limit);
    }
    return this.sectionService.findAll();
  }
  @Get(':id')
  getSectionById(@Param('id', ParseIntPipe) id: number): Promise<Section> {
    return this.sectionService.findOne(id);
  }

  @Post()
  @HttpCode(201)
  @ApiBody({ type: [CreateSectionDTO] })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Section,
    status: 201,
  })
  @UseGuards(AuthGuard('jwt'))
  createSection(
    @Body(ValidationPipe) sectionData: CreateSectionDTO,
    @UserDecorator() user: User,
  ) {
    return this.sectionService.create(sectionData, user);
  }
  @Put(':id')
  @ApiBody({ type: [UpdateSectionDTO] })
  @UseGuards(AuthGuard('jwt'))
  updateSection(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) sectionData: UpdateSectionDTO,
    @UserDecorator() user: User,
  ) {
    return this.sectionService.update(id, sectionData, user);
  }
  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AuthGuard('jwt'))
  deleteSection(
    @Param('id', ParseIntPipe) id: number,
    @UserDecorator() user: User,
  ): Promise<void> {
    return this.sectionService.remove(id, user);
  }
  @Get(':id/assign')
  @UseGuards(AuthGuard('jwt'))
  assignUserToSection(
    @Param('id', ParseIntPipe) id: number,
    @UserDecorator() user: User,
  ) {
    return this.sectionService.assign(id, user);
  }
}
