import { Logger } from '@nestjs/common'
import 'reflect-metadata'
import { RolesEnum } from '../../../role/enum/roles.enum'
import { RedisService } from '../redis/redis.service'

export class GeneratorCacheableOptions {
    keyPrefix: string
    ttl?: number
    includedIndexes?: number[]
}

const logger: Logger = new Logger('GeneratorCache')

export function GeneratorCacheable(options: GeneratorCacheableOptions) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value

        const wrappedMethod = async function (...args: any[]) {
            const redisService: RedisService = this.redisService
            if (!redisService) throw new Error('Redis service required')

            const acceptedArgs = args.filter((item, index) => options.includedIndexes?.includes(index))

            const keySuffix = JSON.stringify(acceptedArgs)
            const cacheKey = `${options.keyPrefix}:${keySuffix}`

            const cached = await redisService.get(cacheKey)
            if (cached) {
                logger.log(`Данные по ключу ${cacheKey} найдены в кэше`)
                return JSON.parse(cached.toString())
            }

            const result = await originalMethod.apply(this, args)
            await redisService.set(cacheKey, JSON.stringify(result), options.ttl ?? 3600)
            return result
        }

        const metadataKeys = Reflect.getMetadataKeys(originalMethod)
        for (const key of metadataKeys) {
            const value = Reflect.getMetadata(key, originalMethod)
            Reflect.defineMetadata(key, value, wrappedMethod)
        }

        descriptor.value = wrappedMethod

        return descriptor
    }
}
