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
  Req,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { Roles } from '../common/decorators/role.decorator.js';
import { UserRole } from '../common/types/enums/user-role.enum.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.js';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Per-resource ownership: a caller may only act on their own account, unless
  // they are an ADMIN. RolesGuard cannot express this, since it has no notion of
  // the record being addressed.
  private assertSelfOrAdmin(
    request: AuthenticatedRequest,
    targetUserId: string,
  ): void {
    const actor = request.user;

    if (!actor) {
      throw new UnauthorizedException('User not authenticated');
    }

    if (actor.role !== UserRole.ADMIN && actor.id !== targetUserId) {
      throw new ForbiddenException('You can only access your own account');
    }
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new user (ADMIN only)' })
  @ApiResponse({ status: 201, description: 'User successfully created.' })
  @ApiBadRequestResponse({ description: 'Invalid input payload.' })
  @ApiForbiddenResponse({ description: 'Requires ADMIN role access.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Retrieve all users (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'List of all users.' })
  @ApiForbiddenResponse({ description: 'Requires ADMIN role access.' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a user by ID (self or ADMIN)' })
  @ApiResponse({ status: 200, description: 'User details found.' })
  @ApiForbiddenResponse({ description: 'Cannot access another user account.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() request: AuthenticatedRequest,
  ) {
    this.assertSelfOrAdmin(request, id);

    return this.usersService.findOneById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user profile details (self or ADMIN)' })
  @ApiResponse({ status: 200, description: 'User details successfully updated.' })
  @ApiForbiddenResponse({ description: 'Cannot modify another user account.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: AuthenticatedRequest,
  ) {
    this.assertSelfOrAdmin(request, id);

    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user by ID (self or ADMIN)' })
  @ApiResponse({ status: 204, description: 'User successfully deleted.' })
  @ApiForbiddenResponse({ description: 'Cannot delete another user account.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() request: AuthenticatedRequest,
  ) {
    this.assertSelfOrAdmin(request, id);

    return this.usersService.remove(id);
  }
}
