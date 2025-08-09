import { ApiProperty } from '@nestjs/swagger'

export class TestBaseDto {
    @ApiProperty()
    id: string

    @ApiProperty()
    data: string

    @ApiProperty()
    // @AutoFill()
    createdAt: Date
}
