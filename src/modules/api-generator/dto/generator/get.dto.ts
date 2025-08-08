import { SwaggerMethodsDto } from '../swagger/main.dto'
import { CanActivate } from '@nestjs/common'

export class GeneratorGetMethodDto {
    swagger?: SwaggerMethodsDto
    guards?: CanActivate[]
}
