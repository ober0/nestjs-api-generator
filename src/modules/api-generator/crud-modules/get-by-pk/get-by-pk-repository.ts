import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common'
import { GeneratorMainDto } from '../../dto/generator/main.dto'
import { OrmEnum } from '../../enums/orm.enum'

export function createCrudGetByPkRepository(data: GeneratorMainDto, dbServiceToken: string) {
    @Injectable()
    class CrudGetByPkRepository {
        constructor(@Inject(dbServiceToken) readonly dbService: any) {}

        async getByPk(pk: any): Promise<InstanceType<typeof data.methods.getByPk.responseType>> {
            try {
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
            } catch (error) {
                switch (data.db.orm) {
                    case OrmEnum.Prisma:
                        if (error.name === 'PrismaClientValidationError') {
                            throw new InternalServerErrorException(`Указано некорректное значение pk в схеме для таблицы ${data.db.model}`)
                        }
                        break
                    default:
                        throw new Error(`ORM ${data.db.orm} not supported in getByPk method`)
                }
                throw error
            }
        }
    }
    return CrudGetByPkRepository
}
