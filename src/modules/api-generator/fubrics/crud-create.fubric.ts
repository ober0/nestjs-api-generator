import { Module } from '@nestjs/common'
import { GeneratorMainDto } from '../dto/generator/main.dto'
import { createCrudGetAllService } from '../crud-modules/get-all/get-all-service'
import { createCrudGetAllController } from '../crud-modules/get-all/get-all-controller'
import { applyGetAllDecorators } from '../crud-modules/get-all/get-all-decorators'
import { applyDecoratorsToController } from '../crud-modules/global/create-decorators'
import { createCrudGetAllRepository } from '../crud-modules/get-all/get-all-repository'
import { createCrudCreateController } from '../crud-modules/create/create-controller'
import { applyCreateDecorators } from '../crud-modules/create/create-decorators'
import { createCrudCreateRepository } from '../crud-modules/create/create-repository'
import { createCrudCreateService } from '../crud-modules/create/create-service'
import { MethodsEnum } from '../enums/methods.enum'
import { generateModuleToken } from '../tools/generate-module-token'
import { CrudFileTypeKeys } from '../enums/file-types.enum'
import { createCrudCommonService } from '../crud-modules/global/common.service'

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

    generateGetAllMethod() {
        if (this.data.methods.getAll) {
            const repoToken = generateModuleToken({
                type: CrudFileTypeKeys.Repository,
                key: this.data.path,
                method: MethodsEnum.GetAll
            })

            const GetAllRepository = createCrudGetAllRepository(this.data, this.dbServiceToken)
            this.providers.push({
                provide: repoToken,
                useClass: GetAllRepository
            })

            const serviceToken = generateModuleToken({
                type: CrudFileTypeKeys.Service,
                key: this.data.path,
                method: MethodsEnum.GetAll
            })

            const GetAllService = createCrudGetAllService(this.data, repoToken)
            this.providers.push({
                provide: serviceToken,
                useClass: GetAllService
            })

            const GetAllController = createCrudGetAllController(this.data, serviceToken)
            this.controllers.push(GetAllController)

            applyGetAllDecorators(GetAllController, MethodsEnum.GetAll, this.data)
        }
    }

    applyDecorators() {
        this.controllers.forEach((controller) => {
            applyDecoratorsToController(controller, this.data)
        })
    }

    generateCreateMethod() {
        if (this.data.methods.create) {
            const repoToken = generateModuleToken({
                type: CrudFileTypeKeys.Repository,
                key: this.data.path,
                method: MethodsEnum.Create
            })

            const CreateRepository = createCrudCreateRepository(this.data, this.dbServiceToken)
            this.providers.push({
                provide: repoToken,
                useClass: CreateRepository
            })

            const serviceToken = generateModuleToken({
                type: CrudFileTypeKeys.Service,
                key: this.data.path,
                method: MethodsEnum.Create
            })

            const CreateService = createCrudCreateService(this.data, repoToken)
            this.providers.push({
                provide: serviceToken,
                useClass: CreateService
            })

            const CreateController = createCrudCreateController(this.data, serviceToken)
            this.controllers.push(CreateController)

            applyCreateDecorators(CreateController, MethodsEnum.Create, this.data)
        }
    }

    generateCommonService() {
        const token = this.data?.injectServiceToken ?? null
        if (!token) return
        const CreateService = createCrudCommonService(this.data)
        this.providers.push({
            provide: token,
            useClass: CreateService
        })
    }
}

export function createCrud(data: GeneratorMainDto) {
    const crudFabric = new CrudFabric(data)
    crudFabric.generateGetAllMethod()
    crudFabric.generateCreateMethod()
    crudFabric.generateCommonService()
    crudFabric.applyDecorators()

    console.log(crudFabric.providers)

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
