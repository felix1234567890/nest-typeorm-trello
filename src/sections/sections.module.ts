import { Module } from '@nestjs/common';
import { SectionsController } from './sections.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectionsService } from './sections.service';
import { SectionRepository } from './section.repository';
import { UserRepository } from 'src/auth/user.repository';
@Module({
  imports: [TypeOrmModule.forFeature([SectionRepository, UserRepository])],
  controllers: [SectionsController],
  providers: [SectionsService],
})
export class SectionsModule {}
