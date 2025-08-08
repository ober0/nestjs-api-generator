import { Injectable } from '@nestjs/common'
import { GeneratorMainDto } from '../../dto/generator/main.dto'

export function createCrudGetAllService(data: GeneratorMainDto) {
    @Injectable()
    class CrudGetAllService {
        async getAll() {
            return 'some data'
        }
    }
    return CrudGetAllService
}
