import { IsNumber, IsString, IsNotEmpty, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookDto {

    @IsNotEmpty()
    @IsNumber()
    readonly id: number;

    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    readonly title: string;
    
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    readonly author: string;

    @IsNumber()
    @IsNotEmpty()
    @IsDate()
    @Type(() => Number)
    readonly year: number;
    
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    readonly genre: string;
}