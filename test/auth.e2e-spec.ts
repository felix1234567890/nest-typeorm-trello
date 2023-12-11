import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/auth/user.entity';
import request from 'supertest';

describe('Auth (e2e)', () => {
	let app: INestApplication;
	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AuthModule],
		})
			.overrideProvider(getRepositoryToken(User))
			.useValue({
				create: jest.fn().mockResolvedValue({ username: 'fr' }),
				save: jest.fn().mockResolvedValue({ username: 'fr' } as User),
			})
			.compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/ (GET)', () => {
		return request(app.getHttpServer()).get('/auth').expect(401);
	});

	it('/register (POST)', () => {
		return request(app.getHttpServer())
			.post('/auth/register')
			.send({
				username: 'frane',
				email: 'frane@frane.com',
				password: 'Frane11!',
			})
			.expect((response: request.Response) => {
				const { username } = response.body;
				expect(username).toEqual('fr');
			});
	});
});
