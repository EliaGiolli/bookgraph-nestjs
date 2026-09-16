import { IsUUID } from 'class-validator';

export class DeleteBookDto {
  @IsUUID()
  readonly id: string;
}
