import { Body, Controller, Inject, Post } from '@nestjs/common'
import { GeneratorMainDto } from '../../dto/generator/main.dto'

export function createCrudCreateController(data: GeneratorMainDto, serviceToken: string) {
    @Controller(data.path)
    class CrudCreateController {
        constructor(@Inject(serviceToken) public readonly service: any) {}

        @Post(data.methods?.create?.path ?? '')
        async create(@Body() dto: InstanceType<typeof data.methods.create.dto>): Promise<InstanceType<typeof data.methods.create.responseType>> {
            return this.service.create(dto)
        }
    }

    return CrudCreateController
}
