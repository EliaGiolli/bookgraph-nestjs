import { IsUUID, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDifferentFrom } from '../../common/validators/is-different-from.validator.js';

export class CreateBookConnectionDto {
  @ApiProperty({
    description: 'UUID of the source book',
    example: 'd3b07384-d113-424a-a521-30596287f391',
  })
  @IsUUID()
  sourceBookId: string;

  @ApiProperty({
    description: 'UUID of the target/discovered book. Must differ from sourceBookId.',
    example: 'e5c18495-e224-535b-b632-41607398f402',
  })
  @IsUUID()
  @IsDifferentFrom('sourceBookId', {
    message: 'discoveredBookId must be different from sourceBookId',
  })
  discoveredBookId: string;

  @ApiPropertyOptional({
    description: 'Optional relationship description or connection note',
    example: 'Prequel / Direct Influence',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
