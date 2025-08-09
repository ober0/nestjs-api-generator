import { GeneratorCommonMethodDto } from './common-methods.dto'
import { Type } from '@nestjs/common'

export class GeneratorCreateMethodDto extends GeneratorCommonMethodDto {
    /**
     * ручная установка дто ( выше автогенерации )
     */
    dto: Type<any>
}
