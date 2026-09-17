import { PartialType } from '@nestjs/swagger';
import { CreateBookConnectionDto } from './create-book-connection.dto.js';

export class UpdateBookConnectionDto extends PartialType(CreateBookConnectionDto) {}
