import { SwaggerMethodsDto } from '../swagger/main.dto'
import { CanActivate, Type } from '@nestjs/common'

export class GeneratorCommonMethodDto {
    /**
     * Конфигурация сваггера
     */
    swagger?: SwaggerMethodsDto
    /**
     * Гуарды на ручке
     */
    guards?: Type<CanActivate>[]
    /**
     * Массив декораторов на ручке (ТД MethodDecorator)
     */
    customDecorators?: AllowedDecorator[]
    /**
     * Доп. url к ручке
     */
    path?: string
    /**
     * ручная установка типа ответа
     */
    responseType?: Type<any>
}
