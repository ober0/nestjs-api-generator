import { Inject, Injectable } from '@nestjs/common'
import { GeneratorMainDto } from '../../dto/generator/main.dto'

export function createCrudCreateService(data: GeneratorMainDto, repoToken: string) {
    @Injectable()
    class CrudCreateService {
        constructor(@Inject(repoToken) public readonly repository: any) {}

        async create(dto: InstanceType<typeof data.methods.create.dto>): Promise<InstanceType<typeof data.methods.create.responseType>> {
            return this.repository.create(dto)
        }
    }
    return CrudCreateService
}
