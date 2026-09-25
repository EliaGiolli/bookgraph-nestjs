import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Delete, 
  Param, 
  Query, 
  ParseUUIDPipe, 
  UseGuards,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UnauthorizedException
} from '@nestjs/common';
// Swagger OpenAPI
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiNotFoundResponse
} from '@nestjs/swagger';
//Services, Entities and so on
import { BooksService } from './books.service.js';
import { Book } from './entities/books.entity.js';
// DTOs
import { CreateBookDto } from './dto/create-book.dto.js';
import { GetBooksFilterDto } from './dto/get-book-filter.dto.js';

// Guards
import {JwtAuthGuard} from '../common/guards/jwt-auth.guard.js';
import { UpdateBookDto } from './dto/update-book.dto.js';
import { DeleteBookDto } from './dto/delete-book.dto.js';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.js';

@ApiTags('Books')
@ApiBearerAuth()
// A book belongs to exactly one user, so every route here needs an identity —
// including the reads, which are scoped to the caller's own library.
@UseGuards(JwtAuthGuard)
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  private userIdOf(request: AuthenticatedRequest): string {
    const userId = request.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    return userId;
  }

  @Get()
  @ApiOperation({ summary: "Search and filter the caller's own books" })
  @ApiResponse({ status: 200, description: 'List of books retrieved successfully.' })
  findAll(
    @Query() filterDto: GetBooksFilterDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<Book[]> {
    return this.booksService.findAll(filterDto, this.userIdOf(request));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one of the caller\'s books by ID' })
  @ApiResponse({ status: 200, description: 'Book details retrieved successfully.' })
  @ApiNotFoundResponse({ description: 'Book not found or does not belong to you.' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() request: AuthenticatedRequest,
  ): Promise<Book> {
    return this.booksService.findOne(id, this.userIdOf(request));
  }

  @Post()
  @ApiOperation({ summary: 'Register a new book' })
  @ApiResponse({ status: 201, description: 'Book successfully created.' })
  @ApiBadRequestResponse({ description: 'Invalid input payload.' })
  createBook(
    @Body() createBookDto: CreateBookDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.booksService.create(createBookDto, this.userIdOf(request));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a book' })
  @ApiResponse({ status: 200, description: 'Book successfully updated.' })
  @ApiNotFoundResponse({ description: 'Book not found or does not belong to you.' })
  updateBook(
    @Body() updateBookDto: UpdateBookDto,
    @Param('id', ParseUUIDPipe) id: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.booksService.update(id, updateBookDto, this.userIdOf(request));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a book' })
  @ApiResponse({ status: 204, description: 'Book successfully deleted.' })
  @ApiBadRequestResponse({ description: 'Route id and body id do not match.' })
  @ApiNotFoundResponse({ description: 'Book not found or does not belong to you.' })
  deleteBook(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() deleteBookDto: DeleteBookDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const userId = this.userIdOf(request);

    if (deleteBookDto.id && deleteBookDto.id !== id) {
      throw new BadRequestException('Route id and body id do not match');
    }

    return this.booksService.remove(id, userId);
  }
}
