import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common'
import { GeneratorMainDto } from '../../dto/generator/main.dto'

export function createCrudGetByPkController(data: GeneratorMainDto, serviceToken: string) {
    @Controller(data.path)
    class CrudGetByPkController {
        constructor(@Inject(serviceToken) public readonly service: any) {}

        @Get(data.methods?.getByPk?.path ? `${data.methods?.getByPk?.path}/:pk` : ':pk')
        async getByPk(@Param('pk') pk: any): Promise<InstanceType<typeof data.methods.getByPk.responseType>> {
            return this.service.getByPk(pk)
        }
    }

    return CrudGetByPkController
}
