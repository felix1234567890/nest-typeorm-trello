import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsOptional,
  Matches,
} from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'Username is too short' })
  @MaxLength(40, { message: 'Username is by our standards too long' })
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(14)
  @Matches(
    /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
    {
      message:
        'Password is too weak. It should include at least an uppercase letter, number and special character.',
    },
  )
  password: string;
}
export class UpdateUserDTO {
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Username is too short' })
  @MaxLength(40, { message: 'Username is by our standards too long' })
  username?: string;

  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email?: string;
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MinLength(6)
  @MaxLength(14)
  @Matches(
    /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
    {
      message:
        'Password is too weak. It should include at least an uppercase letter, number and special character.',
    },
  )
  password?: string;
}
export class LoginUserDTO {
  email: string;
  password: string;
}
