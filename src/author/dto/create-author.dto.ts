import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAuthorDto {
  // MaxLength mirrors the column widths in the authors table, so an over-long
  // value fails as a 400 rather than a database error.
  @ApiProperty({
    description: 'Full name of the author',
    example: 'Frank Herbert',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name!: string;

  @ApiPropertyOptional({
    description: 'Short biography of the author',
    example: 'American science fiction author best known for Dune.',
  })
  @IsOptional()
  @IsString()
  bio?: string;
}
