import { Module } from '@nestjs/common'
import { GeneratorMainDto } from '../dto/generator/main.dto'
import { createCrudGetAllService } from '../crud-modules/get-all/get-all-service'
import { createCrudGetAllController } from '../crud-modules/get-all/get-all-controller'
import { applyGetDecorators } from '../crud-modules/get-all/get-all-decorators'
import { applyDecoratorsToController } from '../crud-modules/global/create-decorators'

export function createCrud(data: GeneratorMainDto) {
    const providers = []
    const controllers = []

    if (data.methods.getAll) {
        const serviceToken = `CrudGetAllService_${data.path}`

        const GetAllService = createCrudGetAllService(data)
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
