import { Module } from '@nestjs/common'
import { GeneratorMainDto } from '../dto/generator/main.dto'
import { createCrudGetAllService } from '../crud-modules/get-all/get-all-service'
import { createCrudGetAllController } from '../crud-modules/get-all/get-all-controller'
import { applyGetDecorators } from '../crud-modules/get-all/get-all-decorators'
import { applyDecoratorsToController } from '../crud-modules/global/create-decorators'
import { createCrudGetAllRepository } from '../crud-modules/get-all/get-all-repository'

export function createCrud(data: GeneratorMainDto) {
    const providers = []
    const controllers = []

    const dbServiceToken = `${data.path}_DbService`

    providers.push({
        provide: dbServiceToken,
        useExisting: data.db.dbService
    })

    if (data.methods.getAll) {
        const repoToken = `CrudGetAllRepo_${data.path}`

        const GetAllRepository = createCrudGetAllRepository(data, dbServiceToken)
        providers.push({
            provide: repoToken,
            useClass: GetAllRepository
        })

        const serviceToken = `CrudGetAllService_${data.path}`

        const GetAllService = createCrudGetAllService(data, repoToken)
        providers.push({
            provide: serviceToken,
            useClass: GetAllService
        })

        const GetAllController = createCrudGetAllController(data, serviceToken)
        controllers.push(GetAllController)

        applyGetDecorators(GetAllController, 'getAll', data)
    }

    controllers.forEach((controller) => {
        applyDecoratorsToController(controller, data)
    })

    @Module({
        controllers,
        providers,
        exports: providers
    })
    class GeneratedModule {}

    return {
        module: GeneratedModule,
        controllers,
        providers,
        exports: providers
    }
}
