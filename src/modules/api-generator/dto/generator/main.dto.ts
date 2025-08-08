import { GeneratorGetAllMethodDto } from './get-all.dto'
import { SwaggerClassDto } from '../swagger/main.dto'

export class GeneratorMainDto {
    methods: {
        getAll?: GeneratorGetAllMethodDto
    }
    swagger?: SwaggerClassDto
    path: string
    prismaModel: any
    customDecorators?: AllowedDecorator[]
}
