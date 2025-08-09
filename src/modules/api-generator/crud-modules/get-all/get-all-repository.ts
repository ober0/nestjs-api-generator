import { Inject, Injectable } from '@nestjs/common'
import { GeneratorMainDto } from '../../dto/generator/main.dto'
import { OrmEnum } from '../../enums/orm.enum'

export function createCrudGetAllRepository(data: GeneratorMainDto, dbServiceToken: string) {
    @Injectable()
    class CrudGetAllRepository {
        constructor(@Inject(dbServiceToken) readonly dbService: any) {}

        async getAll(): Promise<InstanceType<typeof data.methods.getAll.responseType>> {
            switch (data.db.orm) {
                case OrmEnum.Prisma:
                    return this.dbService[data.db.model].findMany()
                default:
                    throw new Error(`ORM ${data.db.orm} not supported in create method`)
            }
        }
    }
    return CrudGetAllRepository
}
