import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Delete, 
  Param, 
  Request,
  Query, 
  ParseUUIDPipe, 
  UseGuards,
  Body,
  Req,
  UnauthorizedException
} from '@nestjs/common';
// Swagger OpenAPI
import { 
  ApiTags, 
  ApiOperation, 
  ApiQuery, 
  ApiResponse 
} from '@nestjs/swagger';
//Services, Entities and so on
import { BooksService } from './books.service.js';
import { Book } from './entities/books.entity.js';
import { CreateBookDto } from './dto/create-book.dto.js';

// Guards
import { AuthGuard } from '@nestjs/passport';
import { UpdateBookDto } from './dto/update-book.dto.js';
import { DeleteBookDto } from './dto/delete-book.dto.js';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve public list of books with optional search filters' })
  @ApiQuery({ name: 'search', required: false, description: 'Filter by title or author name' })
  @ApiQuery({ name: 'authorId', required: false, description: 'Filter by Author UUID' })
  @ApiQuery({ name: 'tagId', required: false, description: 'Filter by Tag UUID' })
  @ApiResponse({ status: 200, description: 'List of books retrieved successfully.' })
  findAll(
    @Query('search') search?: string,
    @Query('authorId') authorId?: string,
    @Query('tagId') tagId?: string,
  ): Promise<Book[]> {
    return this.booksService.findAll(search, authorId, tagId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific book by ID' })
  @ApiResponse({ status: 200, description: 'Book details retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Book> {
    return this.booksService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Post('books')
  createBook(@Body() createBookDto: CreateBookDto, id: string) {
    return this.booksService.create(createBookDto, id)
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  updateBook(
    @Body() updateBookDto: UpdateBookDto,
    @Param('id', ParseUUIDPipe) id: string,
    @Req() request: Request & { user?: { id: string } },
  ) {
    const userId = request.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    return this.booksService.update(id, updateBookDto, userId);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteBook(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() deleteBookDto: DeleteBookDto,
    @Req() request: Request & { user?: { id: string } },
  ) {
    const userId = request.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    if (deleteBookDto.id && deleteBookDto.id !== id) {
      throw new Error('Route id and body id do not match');
    }

    return this.booksService.remove(id);
  }
}