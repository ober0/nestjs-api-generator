import { Inject, Injectable } from '@nestjs/common'
import { GeneratorMainDto } from '../../dto/generator/main.dto'
import { GeneratorRedisService } from '../../cache/redis/redis.service'
import { GeneratorCacheable } from '../../cache/decorators/cache.decorator'

export function createCrudGetAllService(data: GeneratorMainDto, repoToken: string) {
    @Injectable()
    class CrudGetAllService {
        constructor(
            @Inject(repoToken) public readonly repository: any,
            public readonly redisService: GeneratorRedisService
        ) {}

        async getAll(): Promise<InstanceType<typeof data.methods.getAll.responseType>> {
            return this.repository.getAll()
        }
    }

    if (data.cache) {
        const ttl = typeof data.cache === 'object' ? data.cache.ttl : 3600
        const decorator = GeneratorCacheable({
            keyPrefix: `generator/cache/get-all/${data.path}/${data.methods.getAll.path}`,
            ttl
        })

        const descriptor = Object.getOwnPropertyDescriptor(CrudGetAllService.prototype, 'getAll')!
        decorator(CrudGetAllService.prototype, 'getAll', descriptor)
        Object.defineProperty(CrudGetAllService.prototype, 'getAll', descriptor)
    }

    return CrudGetAllService
}
