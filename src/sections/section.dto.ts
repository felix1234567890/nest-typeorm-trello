import {
  MinLength,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSectionDTO {
  @IsNotEmpty()
  @MinLength(3)
  @IsString()
  @ApiProperty({ minimum: 3 })
  title: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  label: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
  })
  position: number;
}
export class UpdateSectionDTO {
  @MinLength(3)
  @IsOptional()
  title?: string;
  label?: string;
  description?: string;
  position?: number;
}
export class PaginationDTO {
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  readonly skip?: number;
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  readonly take?: number;
}
