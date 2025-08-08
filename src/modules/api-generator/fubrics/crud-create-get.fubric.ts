import { Controller, Get, HttpCode, Injectable, UseGuards } from '@nestjs/common'
import { ApiTags, ApiResponse, ApiSecurity } from '@nestjs/swagger'
import { GeneratorMainDto } from '../dto/generator/main.dto'

export function createCrudGet(options: GeneratorMainDto) {
    const path = options.path
    const prismaModel = options.prismaModel
    const getSwagger = options.get?.swagger
    const classSwagger = options.swagger

    @Injectable()
    class CrudService {
        async findAll() {
            return '1'
        }
    }

    @Controller(path)
    class CrudController {
        constructor(public readonly service: CrudService) {}

        @Get()
        @HttpCode(getSwagger?.statusCode ?? 200)
        async handle() {
            return this.service.findAll()
        }
    }

    if (classSwagger?.apiTag) {
        ApiTags(classSwagger.apiTag)(CrudController)
    }

    if (options.get.guards.length) {
        Reflect.decorate([UseGuards(...options.get.guards)], CrudController.prototype, 'handle', Object.getOwnPropertyDescriptor(CrudController.prototype, 'handle'))
    }

    if (options?.get?.swagger?.apiSecurity) {
        ApiSecurity(options?.get?.swagger?.apiSecurity)(CrudController)
    }

    if (getSwagger?.summary || getSwagger?.responseType || getSwagger?.statusCode) {
        Reflect.decorate(
            [
                ApiResponse({
                    status: getSwagger?.statusCode ?? 200,
                    description: getSwagger?.summary,
                    type: getSwagger?.responseType ? getSwagger.responseType : undefined
                })
            ],
            CrudController.prototype,
            'handle',
            Object.getOwnPropertyDescriptor(CrudController.prototype, 'handle')
        )
    }

    class GeneratedModule {}

    return {
        module: GeneratedModule,
        controllers: [CrudController],
        providers: [CrudService],
        exports: [CrudService]
    }
}
