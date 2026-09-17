import { IsUUID, IsString, IsOptional, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookConnectionDto {
  @ApiProperty({
    description: 'UUID of the source book',
    example: 'd3b07384-d113-424a-a521-30596287f391',
  })
  @IsUUID()
  sourceBookId: string;

  @ApiProperty({
    description: 'UUID of the target/discovered book',
    example: 'e5c18495-e224-535b-b632-41607398f402',
  })
  @IsUUID()
  @ValidateIf((o: CreateBookConnectionDto) => {
    if (o.discoveredBookId === o.sourceBookId) {
      throw new Error('discoveredBookId must be different from sourceBookId');
    }
    return true;
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