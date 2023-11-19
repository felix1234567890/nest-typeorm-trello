import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { User } from './user.entity';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';

export const userRepository = {
  provide: getRepositoryToken(User),
  useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
  inject: [getDataSourceToken()],
};
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development',
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
  providers: [AuthService, JwtStrategy, 
    userRepository
  ],
  controllers: [AuthController],
  exports: [userRepository],
})
export class AuthModule {}
