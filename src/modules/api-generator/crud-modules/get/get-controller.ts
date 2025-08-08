import { Controller, Get, HttpCode, Inject } from '@nestjs/common'
import { GeneratorMainDto } from '../../dto/generator/main.dto'

export function createCrudGetController(data: GeneratorMainDto, serviceToken: string) {
    @Controller(data.path)
    class CrudGetController {
        constructor(@Inject(serviceToken) public readonly service: any) {}

        @Get(data.get?.path ?? '')
        @HttpCode(data.get?.swagger?.statusCode ?? 200)
        async get() {
            return this.service.findAll()
        }
    }

    return CrudGetController
}
