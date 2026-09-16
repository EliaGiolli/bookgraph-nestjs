import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BookRole } from '../../common/types/enums/book-role.enum.js'; 

export class GetBooksFilterDto {
  @ApiPropertyOptional({ description: 'Filter by title or author name' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by Author UUID' })
  @IsOptional()
  @IsUUID()
  authorId?: string;

  @ApiPropertyOptional({ description: 'Filter by Tag UUID' })
  @IsOptional()
  @IsUUID()
  tagId?: string;

  @ApiPropertyOptional({ enum: BookRole, description: 'Filter by book status' })
  @IsOptional()
  @IsEnum(BookRole, { message: 'status must be a valid BookRole value (read, reading, wishlist)' })
  status?: BookRole;
}