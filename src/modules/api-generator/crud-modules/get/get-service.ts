import { Injectable } from '@nestjs/common'
import { GeneratorMainDto } from '../../dto/generator/main.dto'

export function createCrudGetService(data: GeneratorMainDto) {
    @Injectable()
    class CrudGetService {
        async findAll() {
            return 'some data'
        }
    }
    return CrudGetService
}
