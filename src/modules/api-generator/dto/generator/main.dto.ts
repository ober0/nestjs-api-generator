import { GeneratorGetAllMethodDto } from './get-all.dto'
import { SwaggerClassDto } from '../swagger/main.dto'
import { OrmEnum } from '../../enums/orm.enum'
import { GeneratorCreateMethodDto } from './create.dto'

export class DbModelsDto {
    model: string
    dbService: any
    orm: OrmEnum
    pk: string
}

export class GeneratorMainDto {
    methods: {
        getAll?: GeneratorGetAllMethodDto
        create?: GeneratorCreateMethodDto
    }
    swagger?: SwaggerClassDto
    path: string
    db: DbModelsDto
    customDecorators?: AllowedDecorator[]
}
