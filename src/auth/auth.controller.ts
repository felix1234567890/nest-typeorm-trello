import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Delete,
	Get,
	HttpCode,
	Post,
	Put,
	Res,
	UseGuards,
	UseInterceptors,
	ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { AuthService } from './auth.service.ts';
import { UserDecorator } from './user.decorator.ts';
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from './user.dto.ts';
import { User } from './user.entity.ts';

@ApiTags('users')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	@HttpCode(201)
	@UseInterceptors(ClassSerializerInterceptor)
	@ApiBody({ type: [CreateUserDTO] })
	createUser(@Body(ValidationPipe) data: CreateUserDTO): Promise<User> {
		return this.authService.createUser(data);
	}
	@Post('login')
	@ApiBody({ type: [LoginUserDTO] })
	loginUser(@Body(ValidationPipe) data: LoginUserDTO): Promise<{ accessToken: string }> {
		return this.authService.loginUser(data);
	}
	@Get()
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(AuthGuard())
	async findAll(): Promise<User[]> {
		return await this.authService.getAllUsers();
	}
	@Get('/me')
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(AuthGuard())
	findUserById(@UserDecorator() user: User): User {
		return user;
	}
	@Put()
	@UseGuards(AuthGuard())
	@UseInterceptors(ClassSerializerInterceptor)
	@ApiBody({ type: [UpdateUserDTO] })
	async updateUser(
		@UserDecorator() user: User,
		@Body(ValidationPipe) data: UpdateUserDTO,
	): Promise<User> {
		await this.authService.updateUser(user, data);
		return await this.authService.getUserById(user.id);
	}
	@Delete()
	@UseGuards(AuthGuard())
	async deleteUser(@UserDecorator() user: User, @Res({ passthrough: true }) response: Response) {
		try {
			await this.authService.deleteUser(user);
			return response.json({ message: 'User deleted successfully' });
		} catch (error) {
			throw new Error(error);
		}
	}
}
