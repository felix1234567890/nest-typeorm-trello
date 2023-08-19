import { Injectable, BadRequestException } from '@nestjs/common';
import { LoginUserDTO, CreateUserDTO, UpdateUserDTO } from './user.dto';
import { NotFoundByIdException } from '../exceptions/NotFoundByIdException.exception';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async loginUser(data: LoginUserDTO) {
    const user = await this.userRepository.findOne({
      where: { email: data.email },
    });
    if (!user) throw new NotFoundByIdException('User');
    const match = await bcrypt.compare(data.password, user.password);
    const payload = { user: user.id };
    if (match) {
      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    }
  }
  async createUser(data: CreateUserDTO) {
    try {
      const newUser = this.userRepository.create(data);
      return await this.userRepository.save(newUser);
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY')
        throw new BadRequestException('User with this email already exists');
    }
  }

  async getAllUsers() {
    return await this.userRepository.find();
  }
  async getUserById(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }
  async updateUser(user: User, data: UpdateUserDTO) {
    const { username, password, email } = data;
    if (username) user.username = username;
    if (password) user.password = password;
    if (email) user.email = email;
    return await this.userRepository.update(user.id, user);
  }
  async deleteUser(user: User) {
    return await this.userRepository.delete(user.id);
  }
}
