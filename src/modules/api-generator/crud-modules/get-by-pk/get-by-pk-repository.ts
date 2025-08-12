import { Inject, Injectable } from '@nestjs/common'
import { GeneratorMainDto } from '../../dto/generator/main.dto'
import { OrmEnum } from '../../enums/orm.enum'

export function createCrudGetByPkRepository(data: GeneratorMainDto, dbServiceToken: string) {
    @Injectable()
    class CrudGetByPkRepository {
        constructor(@Inject(dbServiceToken) readonly dbService: any) {}

        async getByPk(pk: any): Promise<InstanceType<typeof data.methods.getByPk.responseType>> {
            let result
            switch (data.db.orm) {
                case OrmEnum.Prisma:
                    result = await this.dbService[data.db.model].findUnique({
                        where: { [data.db.pk]: pk }
                    })
                    break
                default:
                    throw new Error(`ORM ${data.db.orm} not supported in getByPk method`)
            }
            return result
        }
    }
    return CrudGetByPkRepository
}
