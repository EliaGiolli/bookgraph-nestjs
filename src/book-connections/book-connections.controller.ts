import { 
  Controller, 
  Post, 
  Delete, 
  Body, 
  Req, 
  Param, 
  UseGuards, 
  HttpCode, 
  HttpStatus, 
  ParseUUIDPipe, 
} from '@nestjs/common';
import { BookConnectionsService } from './book-connections.service.js';
import { CreateBookConnectionDto } from './dto/create-book-connection.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';

@Controller('book-connections')
@UseGuards(JwtAuthGuard)
export class BookConnectionsController {
  constructor(private readonly connectionsService: BookConnectionsService) {}

  @Post()
  async create(@Body() createDto: CreateBookConnectionDto, @Req() req: any) {
    const userId = req.user.id;
    return this.connectionsService.create(createDto, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    const userId = req.user.id;
    await this.connectionsService.remove(id, userId);
  }
}