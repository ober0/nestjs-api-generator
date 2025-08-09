import { GeneratorCommonMethodDto } from './common-methods.dto'
import { Type } from '@nestjs/common'

export class GeneratorCreateMethodDto extends GeneratorCommonMethodDto {
    dto: Type<any>
}