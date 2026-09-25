import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
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
import { TagsService } from './tags.service.js';
import { CreateTagDto } from './dto/create-tag.dto.js';
import { UpdateTagDto } from './dto/update-tag.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { requireUserId } from '../common/utils/require-user-id.util.js';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.js';

@ApiTags('Tags')
@ApiBearerAuth()
// A tag belongs to exactly one user, so every route is scoped to the caller.
@UseGuards(JwtAuthGuard)
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a tag' })
  @ApiResponse({ status: 201, description: 'Tag successfully created.' })
  @ApiBadRequestResponse({ description: 'Invalid input payload.' })
  @ApiConflictResponse({ description: 'A tag with this name already exists.' })
  create(@Body() createTagDto: CreateTagDto, @Req() request: AuthenticatedRequest) {
    return this.tagsService.create(createTagDto, requireUserId(request));
  }

  @Get()
  @ApiOperation({ summary: "List the caller's tags" })
  @ApiResponse({ status: 200, description: 'List of tags.' })
  findAll(@Req() request: AuthenticatedRequest) {
    return this.tagsService.findAll(requireUserId(request));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve one of the caller\'s tags by ID' })
  @ApiResponse({ status: 200, description: 'Tag details found.' })
  @ApiNotFoundResponse({ description: 'Tag not found or does not belong to you.' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.tagsService.findOne(id, requireUserId(request));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update one of the caller\'s tags' })
  @ApiResponse({ status: 200, description: 'Tag successfully updated.' })
  @ApiNotFoundResponse({ description: 'Tag not found or does not belong to you.' })
  @ApiConflictResponse({ description: 'A tag with this name already exists.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTagDto: UpdateTagDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.tagsService.update(id, updateTagDto, requireUserId(request));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete one of the caller\'s tags' })
  @ApiResponse({ status: 204, description: 'Tag successfully deleted.' })
  @ApiNotFoundResponse({ description: 'Tag not found or does not belong to you.' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.tagsService.remove(id, requireUserId(request));
  }
}
