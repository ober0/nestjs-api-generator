import { GeneratorGetMethodDto } from './get.dto'
import { SwaggerClassDto } from '../swagger/main.dto'

export class GeneratorMainDto {
    get?: GeneratorGetMethodDto
    swagger?: SwaggerClassDto
    path: string
    prismaModel: any
}
