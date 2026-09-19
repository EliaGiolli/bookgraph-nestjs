import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../common/types/enums/user-role.enum.js';

export class CreateUserDto {
  @ApiProperty({
    description: 'First name of the user',
    example: 'Elia',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Giolli',
  })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({
    description: 'Unique username for the account',
    example: 'eliagiolli',
  })
  @IsString()
  @IsNotEmpty()
  username!: string;

  // Plain password: UsersService hashes it. Clients never supply the hash.
  @ApiProperty({
    description: 'Account password (minimum 8 characters)',
    example: 'SuperSecret123!',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;

  @ApiPropertyOptional({
    description: 'Role assigned to the account. Defaults to USER.',
    enum: UserRole,
    example: UserRole.USER,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
