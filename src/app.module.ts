import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SectionsModule } from './sections/sections.module';
import { Section } from './sections/section.entity';
import { CardsModule } from './cards/cards.module';
import { Card } from './cards/card.entity';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  entities: [Section, Card, User],
  synchronize: true,
};
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development',
    }),
    TypeOrmModule.forRoot({
      ...typeOrmConfig,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    }),
    SectionsModule,
    CardsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
