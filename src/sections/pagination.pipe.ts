import { BadRequestException, PipeTransform } from '@nestjs/common';

export class PaginationPipe implements PipeTransform {
	transform(value?: { skip: string; take: string }) {
		const skip = Number.parseInt(value.skip);
		if (Number.isNaN(skip)) throw new BadRequestException('Wrong input value for skip parameter');
		const take = Number.parseInt(value.take);
		if (Number.isNaN(take)) throw new BadRequestException('Wrong input value for limit parameter');
		return { skip, take };
	}
}
