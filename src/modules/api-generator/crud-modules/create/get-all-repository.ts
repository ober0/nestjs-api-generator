import { Inject, Injectable, Type } from '@nestjs/common'
import { GeneratorMainDto } from '../../dto/generator/main.dto'
import { OrmEnum } from '../../enums/orm.enum'

export function createCrudCreateRepository(data: GeneratorMainDto, dbServiceToken: string) {
    @Injectable()
    class CrudCreateRepository {
        constructor(@Inject(dbServiceToken) readonly dbService: any) {}

        async create(dto: InstanceType<typeof data.methods.create.dto>) {
            switch (data.db.orm) {
                case OrmEnum.Prisma:
                    return this.dbService[data.db.model].create({ data: dto })
                default:
                    throw new Error(`ORM ${data.db.orm} not supported in create method`)
            }
        }
    }
    return CrudCreateRepository
}
