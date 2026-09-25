import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
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
} from '@nestjs/swagger';
import { BookConnectionsService } from './book-connections.service.js';
import { CreateBookConnectionDto } from './dto/create-book-connection.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { requireUserId } from '../common/utils/require-user-id.util.js';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.js';

@ApiTags('Book Connections')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('book-connections')
export class BookConnectionsController {
  constructor(private readonly connectionsService: BookConnectionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a connection between two books' })
  @ApiResponse({ status: 201, description: 'Book connection successfully created.' })
  @ApiResponse({ status: 400, description: 'Self-referencing connection or invalid payload.' })
  @ApiResponse({ status: 404, description: 'One or both books not found or belong to another user.' })
  @ApiResponse({ status: 409, description: 'Connection already exists.' })
  async create(
    @Body() createDto: CreateBookConnectionDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.connectionsService.create(createDto, requireUserId(req));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a book connection' })
  @ApiResponse({ status: 204, description: 'Connection successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Connection not found or belongs to another user.' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.connectionsService.remove(id, requireUserId(req));
  }
}