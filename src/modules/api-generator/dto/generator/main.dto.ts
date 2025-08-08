import { GeneratorGetAllMethodDto } from './get-all.dto'
import { SwaggerClassDto } from '../swagger/main.dto'
import { OrmEnum } from '../../enums/orm.enum'

export class DbModelsDto {
    model: string
    dbService: any
    orm: OrmEnum
}

export class GeneratorMainDto {
    methods: {
        getAll?: GeneratorGetAllMethodDto
    }
    swagger?: SwaggerClassDto
    path: string
    db: DbModelsDto
    customDecorators?: AllowedDecorator[]
}
