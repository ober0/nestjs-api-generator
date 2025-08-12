import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { GeneratorMainDto } from '../../dto/generator/main.dto'
import { GeneratorRedisService } from '../../cache/redis/redis.service'
import { GeneratorClearCache } from '../../cache/decorators/cache-clear.decorator'
import { GeneratorCacheable } from '../../cache/decorators/cache.decorator'

export function createCrudGetByPkService(data: GeneratorMainDto, repoToken: string) {
    @Injectable()
    class CrudGetByPkService {
        constructor(
            @Inject(repoToken) public readonly repository: any,
            readonly redisService: GeneratorRedisService
        ) {}

        async getByPk(pk: any): Promise<InstanceType<typeof data.methods.getByPk.responseType>> {
            const data = await this.repository.getByPk(pk)
            if (!data) throw new NotFoundException()
            return data
        }
    }

    if (data.cache) {
        const ttl = typeof data.cache === 'object' ? data.cache.ttl : 3600
        const decorator = GeneratorCacheable({
            keyPrefix: `generator/cache/get-by-pk/${data.path}/${data.methods.getByPk.path}`,
            ttl,
            includedIndexes: [0]
        })

        const descriptor = Object.getOwnPropertyDescriptor(CrudGetByPkService.prototype, 'getByPk')!
        decorator(CrudGetByPkService.prototype, 'getByPk', descriptor)
        Object.defineProperty(CrudGetByPkService.prototype, 'getByPk', descriptor)
    }

    return CrudGetByPkService
}
