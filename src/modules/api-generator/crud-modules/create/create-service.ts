import { Inject, Injectable } from '@nestjs/common'
import { GeneratorMainDto } from '../../dto/generator/main.dto'
import { ClearCache } from '../../../../common/decorators/cache-clear.decorator'
import { GeneratorRedisService } from '../../cache/redis/redis.service'
import { GeneratorCacheable } from '../../cache/decorators/cache.decorator'
import { GeneratorClearCache } from '../../cache/decorators/cache-clear.decorator'

export function createCrudCreateService(data: GeneratorMainDto, repoToken: string) {
    @Injectable()
    class CrudCreateService {
        constructor(
            @Inject(repoToken) public readonly repository: any,
            readonly redisService: GeneratorRedisService
        ) {}

        async create(dto: InstanceType<typeof data.methods.create.dto>): Promise<InstanceType<typeof data.methods.create.responseType>> {
            return this.repository.create(dto)
        }
    }

    if (data.cache) {
        const decorator = GeneratorClearCache({
            keyPrefix: [`generator/cache/get-all/${data.path}/${data.methods.getAll.path}`]
        })

        const descriptor = Object.getOwnPropertyDescriptor(CrudCreateService.prototype, 'create')!
        decorator(CrudCreateService.prototype, 'create', descriptor)
        Object.defineProperty(CrudCreateService.prototype, 'create', descriptor)
    }

    return CrudCreateService
}
