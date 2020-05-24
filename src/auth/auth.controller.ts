import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Put,
  HttpCode,
  Delete,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from './user.dto';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserDecorator } from './user.decorator';
import { User } from './user.entity';
import { response } from 'express';

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
  loginUser(
    @Body(ValidationPipe) data: LoginUserDTO,
  ): Promise<{ accessToken: string }> {
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
  async deleteUser(@UserDecorator() user: User, @Res() response) {
    try {
      await this.authService.deleteUser(user);
      response.json({ message: 'User deleted successfully' });
    } catch (error) {
      throw new Error(error);
    }
  }
}
