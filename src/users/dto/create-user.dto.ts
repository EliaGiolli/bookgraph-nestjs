import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'First name of the user',
    example: 'Elia',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Giolli',
  })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({
    description: 'Unique username for the account',
    example: 'eliagiolli',
  })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({
    description: 'Hashed password for the user',
    example: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn9.623123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  hashedPassword!: string;
}