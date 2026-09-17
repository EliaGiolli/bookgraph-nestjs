import { IsUUID, IsString, IsOptional, ValidateIf } from 'class-validator';

export class CreateBookConnectionDto {
  @IsUUID()
  sourceBookId: string;

  @IsUUID()
  @ValidateIf((o: CreateBookConnectionDto) => {
    if (o.discoveredBookId === o.sourceBookId) {
      throw new Error('discoveredBookId must be different from sourceBookId');
    }
    return true;
  })
  discoveredBookId: string;

  @IsOptional()
  @IsString()
  description?: string;
}