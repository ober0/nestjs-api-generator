import { Body, Controller, Get, HttpCode, Inject, Post } from '@nestjs/common'
import { GeneratorMainDto } from '../../dto/generator/main.dto'
import { ApiBody } from '@nestjs/swagger'

export function createCrudCreateController(data: GeneratorMainDto, serviceToken: string) {
    @Controller(data.path)
    class CrudCreateController {
        constructor(@Inject(serviceToken) public readonly service: any) {}

        @Post(data.methods?.create?.path ?? '')
        async create(@Body() dto: InstanceType<typeof data.methods.create.dto>) {
            console.log(data.methods.create.dto)
            return this.service.create(dto)
        }
    }

    return CrudCreateController
}
