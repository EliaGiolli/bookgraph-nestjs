import { IsDate, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { BookRole } from '../../common/types/enums/book-role.enum.js';

export class CreateBookDto {
    @IsString()
    readonly title: string;

    @IsOptional()
    @IsString()
    readonly description?: string;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    readonly publishedDate?: Date;

    @IsOptional()
    @IsString()
    readonly genre?: string;

    @IsOptional()
    @IsString()
    readonly coverImg?: string;

    @IsOptional()
    @IsString()
    readonly isbn?: string;

    @IsOptional()
    @IsEnum(BookRole)
    readonly status?: BookRole;

    @IsUUID()
    readonly authorId: string
}