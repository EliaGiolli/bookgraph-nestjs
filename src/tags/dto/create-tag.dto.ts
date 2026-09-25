import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTagDto {
  // The owning user is taken from the JWT, never from the request body.
  @ApiProperty({
    description: 'Name of the tag',
    example: 'Cyberpunk',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name!: string;
}
