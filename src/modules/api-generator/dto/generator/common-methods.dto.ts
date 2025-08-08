import { SwaggerMethodsDto } from '../swagger/main.dto'
import { CanActivate, Type } from '@nestjs/common'

export class GeneratorCommonMethodDto {
    swagger?: SwaggerMethodsDto
    guards?: Type<CanActivate>[]
    customDecorators?: AllowedDecorator[]
    path?: string
}
