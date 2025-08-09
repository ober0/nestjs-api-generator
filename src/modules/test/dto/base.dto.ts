import { ApiProperty } from '@nestjs/swagger'
import { AutoFill } from '../../api-generator/decorators/dto.auto-fill.decorator'

export class TestBaseDto {
    @ApiProperty()
    @AutoFill()
    id: string

    @ApiProperty()
    data: string

    @ApiProperty()
    @AutoFill()
    createdAt: Date
}
