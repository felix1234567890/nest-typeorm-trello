import { jest } from '@jest/globals';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from './auth.service.ts';
import { User } from './user.entity.ts';

describe('AuthService', () => {
	let authService: AuthService;
	const userRepository = {
		find: jest.fn<(...args: any[]) => Promise<any>>().mockResolvedValue([
			{
				id: 1,
				username: 'frane',
				email: 'frane@frane.com',
				password: 'password',
			},
		]),
	};

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [
				AuthService,
				{ provide: getRepositoryToken(User), useValue: userRepository },
				{ provide: JwtService, useValue: {} },
			],
		}).compile();

		authService = moduleRef.get(AuthService);
	});
	it('should retrieve users from the database', async () => {
		const users = await authService.getAllUsers();

		expect(userRepository.find).toHaveBeenCalled();
		expect(users).toHaveLength(1);
	});
});
