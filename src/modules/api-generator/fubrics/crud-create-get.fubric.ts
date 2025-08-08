import { Controller, Get, HttpCode, Injectable, UseGuards } from '@nestjs/common'
import { ApiTags, ApiResponse, ApiSecurity, ApiOperation } from '@nestjs/swagger'
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
        async get() {
            return this.service.findAll()
        }
    }

    if (classSwagger?.apiTag) {
        ApiTags(classSwagger.apiTag)(CrudController)
    }

    if (options.get?.guards?.length) {
        Reflect.decorate([UseGuards(...options.get.guards)], CrudController.prototype, 'get', Object.getOwnPropertyDescriptor(CrudController.prototype, 'get'))
    }

    if (options?.get?.swagger?.apiSecurity) {
        ApiSecurity(options?.get?.swagger?.apiSecurity)(CrudController)
    }

    if (options.get?.customDecorators?.length) {
        for (const decorator of options.get.customDecorators) {
            if (Array.isArray(decorator)) {
                const [decoratorFn, args] = decorator
                Reflect.decorate([decoratorFn(...args)], CrudController.prototype, 'get', Object.getOwnPropertyDescriptor(CrudController.prototype, 'get'))
            } else {
                Reflect.decorate([decorator], CrudController.prototype, 'get', Object.getOwnPropertyDescriptor(CrudController.prototype, 'get'))
            }
        }
    }

    if (getSwagger?.responseType || getSwagger?.statusCode) {
        Reflect.decorate(
            [
                ApiResponse({
                    status: getSwagger?.statusCode ?? 200,
                    type: getSwagger?.responseType ? getSwagger.responseType : undefined
                })
            ],
            CrudController.prototype,
            'get',
            Object.getOwnPropertyDescriptor(CrudController.prototype, 'get')
        )
    }

    if (getSwagger?.summary) {
        Reflect.decorate(
            [
                ApiOperation({
                    summary: getSwagger?.summary
                })
            ],
            CrudController.prototype,
            'get',
            Object.getOwnPropertyDescriptor(CrudController.prototype, 'get')
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
