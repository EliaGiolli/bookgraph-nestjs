import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto.js';

// `password` is omitted: changing it needs a dedicated flow that verifies the
// current password. `role` is omitted so a user cannot escalate themselves to
// ADMIN through their own PATCH /users/:id.
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password', 'role'] as const),
) {}
