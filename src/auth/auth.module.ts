import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { User } from './user.entity';

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
	providers: [AuthService, JwtStrategy, userRepository],
	controllers: [AuthController],
	exports: [userRepository],
})
export class AuthModule {}
