import { SwaggerMethodsDto } from '../swagger/main.dto'
import { CanActivate, Type } from '@nestjs/common'

type DecoratorWithArgs = [(...args: any[]) => MethodDecorator, any[]]
type AllowedDecorator = MethodDecorator | DecoratorWithArgs

export class GeneratorGetMethodDto {
    swagger?: SwaggerMethodsDto
    guards?: Type<CanActivate>[]
    customDecorators?: AllowedDecorator[]
}
