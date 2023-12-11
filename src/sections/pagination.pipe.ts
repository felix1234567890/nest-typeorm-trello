import { BadRequestException, PipeTransform } from '@nestjs/common';

export class PaginationPipe implements PipeTransform {
	transform(value?: { skip: string; take: string }) {
		const skip = parseInt(value.skip);
		if (isNaN(skip)) throw new BadRequestException('Wrong input value for skip parameter');
		const take = parseInt(value.take);
		if (isNaN(take)) throw new BadRequestException('Wrong input value for limit parameter');
		return { skip, take };
	}
}
