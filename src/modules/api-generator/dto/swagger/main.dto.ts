import { HttpStatus, Type } from '@nestjs/common'

export class SwaggerClassDto {
    /**
     * Таг в сваггере
     */
    apiTag?: string
}

export class SwaggerMethodsDto {
    /**
     * Описание ручки
     */
    summary?: string
    /**
     * Код ответа
     */
    statusCode?: HttpStatus
    /**
     * bearer для стандартной JWT защиты
     */
    apiSecurity?: string
}
