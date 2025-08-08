import { Module } from '@nestjs/common'
import { GeneratorMainDto } from '../dto/generator/main.dto'
import { createCrudGetService } from '../crud-modules/get/get-service'
import { createCrudGetController } from '../crud-modules/get/get-controller'
import { applyGetDecorators } from '../crud-modules/get/get-decorators'
import { applyDecoratorsToController } from '../crud-modules/global/create-decorators'

export function createCrudGet(data: GeneratorMainDto) {
    const providers = []
    const controllers = []

    if (data.get) {
        const serviceToken = `CrudGetService_${data.path}`

        const GetService = createCrudGetService(data)
        providers.push({
            provide: serviceToken,
            useClass: GetService
        })

        const GetController = createCrudGetController(data, serviceToken)
        controllers.push(GetController)

        applyGetDecorators(GetController, 'get', data)
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
