import { Inject, Injectable, InternalServerErrorException, Type } from '@nestjs/common'
import { GeneratorMainDto } from '../../dto/generator/main.dto'
import { OrmEnum } from '../../enums/orm.enum'

export function createCrudCreateRepository(data: GeneratorMainDto, dbServiceToken: string) {
    @Injectable()
    class CrudCreateRepository {
        constructor(@Inject(dbServiceToken) readonly dbService: any) {}

        async create(dto: InstanceType<typeof data.methods.create.dto>) {
            let result
            switch (data.db.orm) {
                case OrmEnum.Prisma:
                    try {
                        result = await this.dbService[data.db.model].create({ data: dto })
                    } catch (err) {
                        if (err.code === 'P2002') {
                            throw new InternalServerErrorException('Передано уникальное значение. Возможно, некорректно сгенерированы типы, проверьте расставлены ли декораторы AutoFill')
                        }
                    }
                    break
                default:
                    throw new Error(`ORM ${data.db.orm} not supported in create method`)
            }
            return result
        }
    }
    return CrudCreateRepository
}
