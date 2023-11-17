import { TestBed } from '@automock/jest';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: jest.Mocked<Repository<User>>;
  let jwtService: jest.Mocked<JwtService>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(AuthService)
      .mock(getRepositoryToken(User) as string)
      .using({
        find: jest.fn().mockResolvedValue(
          [
            {
              id: 1,
              username: 'frane',
              email: 'frane@frane.com',
              password: 'password',
            },
          ] as User[],
      )})
      .compile();

    authService = unit;
    userRepository = unitRef.get(getRepositoryToken(User) as string);
    jwtService = unitRef.get(JwtService);
  });
  it('should retrieve users from the database', async () => {
    const users = await authService.getAllUsers();

    expect(userRepository.find).toHaveBeenCalled();
    expect(users).toHaveLength(1);
  });
});
