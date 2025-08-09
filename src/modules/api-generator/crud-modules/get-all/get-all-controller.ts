import { Controller, Get, HttpCode, Inject } from '@nestjs/common'
import { GeneratorMainDto } from '../../dto/generator/main.dto'

export function createCrudGetAllController(data: GeneratorMainDto, serviceToken: string) {
    @Controller(data.path)
    class CrudGetAllController {
        constructor(@Inject(serviceToken) public readonly service: any) {}

        @Get(data.methods?.getAll?.path ?? '')
        async getAll(): Promise<InstanceType<typeof data.methods.getAll.responseType>> {
            return this.service.getAll()
        }
    }

    return CrudGetAllController
}
