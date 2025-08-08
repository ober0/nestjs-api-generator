import { HttpStatus } from '@nestjs/common'

export class SwaggerClassDto {
    apiTag?: string
}

export class SwaggerMethodsDto {
    summary?: string
    responseType?: any
    statusCode?: HttpStatus
    apiSecurity?: string
}
