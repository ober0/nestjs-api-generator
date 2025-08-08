import { Inject, Injectable } from '@nestjs/common'
import { GeneratorMainDto } from '../../dto/generator/main.dto'

export function createCrudGetAllService(data: GeneratorMainDto, repoToken: string) {
    @Injectable()
    class CrudGetAllService {
        constructor(@Inject(repoToken) public readonly repository: any) {}

        async getAll() {
            return this.repository.getAll()
        }
    }
    return CrudGetAllService
}
