import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundByIdException extends HttpException {
	constructor(resource: string) {
		super(`${resource} with this id was not found`, HttpStatus.NOT_FOUND);
	}
}
