import { GeneratorCommonMethodDto } from './common-methods.dto'
import { Type } from '@nestjs/common'

export class GeneratorCreateMethodDto extends GeneratorCommonMethodDto {
    /**
     * Ручная установка дто
     */
    dto?: Type<any>
}
