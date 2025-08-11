import { Logger } from '@nestjs/common'
import 'reflect-metadata'
import { RedisService } from '../redis/redis.service'

export class GeneratorClearCacheOptions {
    keyPrefix: string | string[]
}

const logger: Logger = new Logger('GeneratorClearCache')

async function GeneratorDeleteCache(redisService: RedisService, prefix: string) {
    const cacheKey: string = `${prefix}:*`

    const cachedKeys: string[] = await redisService.scanKeysByPrefix(cacheKey)
    if (cachedKeys) {
        await redisService.del(cachedKeys)
        logger.log(`Кэш для ключей ${JSON.stringify(cachedKeys)} удален`)
    }
}

export function GeneratorClearCache(options: GeneratorClearCacheOptions) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value

        const wrappedMethod = async function (...args: any[]) {
            const redisService: RedisService = this.redisService

            const prefixes = Array.isArray(options.keyPrefix) ? options.keyPrefix : [options.keyPrefix]

            await Promise.all(prefixes.map((prefix) => GeneratorDeleteCache(redisService, prefix)))

            return await originalMethod.apply(this, args)
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
