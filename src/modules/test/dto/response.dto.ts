import { ApiProperty } from '@nestjs/swagger'

export class TestResponseDto {
    @ApiProperty()
    uuid: string

    @ApiProperty()
    data: string
}
