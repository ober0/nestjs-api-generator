import { Module } from '@nestjs/common'
import { GeneratorMainDto } from '../dto/generator/main.dto'
import { createCrudGetAllService } from '../crud-modules/get-all/get-all-service'
import { createCrudGetAllController } from '../crud-modules/get-all/get-all-controller'
import { applyGetAllDecorators } from '../crud-modules/get-all/get-all-decorators'
import { applyDecoratorsToController } from '../crud-modules/global/create-decorators'
import { createCrudGetAllRepository } from '../crud-modules/get-all/get-all-repository'
import { createCrudCreateController } from '../crud-modules/create/get-all-controller'
import { applyCreateDecorators } from '../crud-modules/create/get-all-decorators'
import { createCrudCreateRepository } from '../crud-modules/create/get-all-repository'
import { createCrudCreateService } from '../crud-modules/create/get-all-service'

export class CrudFabric {
    public readonly providers: any[] = []
    public readonly controllers: any[] = []

    private readonly data: GeneratorMainDto
    private readonly dbServiceToken: string

    constructor(data: GeneratorMainDto) {
        this.data = data
        this.dbServiceToken = `${data.path}_DbService`

        this.providers.push({
            provide: this.dbServiceToken,
            useExisting: data.db.dbService
        })
    }

    generateFindOneMethod() {
        if (this.data.methods.getAll) {
            const repoToken = `CrudGetAllRepo_${this.data.path}`

            const GetAllRepository = createCrudGetAllRepository(this.data, this.dbServiceToken)
            this.providers.push({
                provide: repoToken,
                useClass: GetAllRepository
            })

            const serviceToken = `CrudGetAllService_${this.data.path}`

            const GetAllService = createCrudGetAllService(this.data, repoToken)
            this.providers.push({
                provide: serviceToken,
                useClass: GetAllService
            })

            const GetAllController = createCrudGetAllController(this.data, serviceToken)
            this.controllers.push(GetAllController)

            applyGetAllDecorators(GetAllController, 'getAll', this.data)
        }
    }

    applyDecorators() {
        this.controllers.forEach((controller) => {
            applyDecoratorsToController(controller, this.data)
        })
    }

    generateCreateMethod() {
        if (this.data.methods.create) {
            const repoToken = `CrudCreateRepo_${this.data.path}`

            const CreateRepository = createCrudCreateRepository(this.data, this.dbServiceToken)
            this.providers.push({
                provide: repoToken,
                useClass: CreateRepository
            })

            const serviceToken = `CrudCreateService_${this.data.path}`

            const CreateService = createCrudCreateService(this.data, repoToken)
            this.providers.push({
                provide: serviceToken,
                useClass: CreateService
            })

            const CreateController = createCrudCreateController(this.data, serviceToken)
            this.controllers.push(CreateController)

            applyCreateDecorators(CreateController, 'create', this.data)
        }
    }
}

export function createCrud(data: GeneratorMainDto) {
    const crudFabric = new CrudFabric(data)

    crudFabric.generateFindOneMethod()
    crudFabric.generateCreateMethod()

    crudFabric.applyDecorators()

    @Module({
        controllers: crudFabric.controllers,
        providers: crudFabric.providers,
        exports: crudFabric.providers
    })
    class GeneratedModule {}

    return {
        module: GeneratedModule,
        controllers: crudFabric.controllers,
        providers: crudFabric.providers,
        exports: crudFabric.providers
    }
}
