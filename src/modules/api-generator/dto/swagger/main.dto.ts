export class SwaggerClassDto {
    /**
     * Таг в сваггере
     */
    apiTag?: string
    /**
     * bearer для стандартной JWT защиты ( если защиты нет - не указывать )
     */
    apiSecurity?: string
}

export class SwaggerMethodsDto {
    /**
     * Описание ручки
     */
    summary?: string
    /**
     * bearer для стандартной JWT защиты ( если защиты нет - не указывать )
     */
    apiSecurity?: string
}
