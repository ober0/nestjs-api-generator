import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class TestCreateDto {
    @ApiProperty()
    @IsString()
    data: string
}