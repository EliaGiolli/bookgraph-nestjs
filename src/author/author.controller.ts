import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { AuthorService } from './author.service.js';
import { CreateAuthorDto } from './dto/create-author.dto.js';
import { UpdateAuthorDto } from './dto/update-author.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';

@ApiTags('Author')
@ApiBearerAuth()
// Authors are shared reference data, so there is no per-user scoping here —
// only the requirement that the caller be authenticated.
@UseGuards(JwtAuthGuard)
@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  @ApiOperation({ summary: 'Create an author' })
  @ApiResponse({ status: 201, description: 'Author successfully created.' })
  @ApiBadRequestResponse({ description: 'Invalid input payload.' })
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorService.create(createAuthorDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all authors' })
  @ApiResponse({ status: 200, description: 'List of authors.' })
  findAll() {
    return this.authorService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve an author by ID' })
  @ApiResponse({ status: 200, description: 'Author details found.' })
  @ApiNotFoundResponse({ description: 'Author not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.authorService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an author' })
  @ApiResponse({ status: 200, description: 'Author successfully updated.' })
  @ApiNotFoundResponse({ description: 'Author not found.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ) {
    return this.authorService.update(id, updateAuthorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an author that has no books' })
  @ApiResponse({ status: 204, description: 'Author successfully deleted.' })
  @ApiNotFoundResponse({ description: 'Author not found.' })
  @ApiConflictResponse({ description: 'Author still has books referencing it.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.authorService.remove(id);
  }
}
