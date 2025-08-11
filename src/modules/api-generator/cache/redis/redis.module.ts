import { Module, Global } from '@nestjs/common'
import Redis from 'ioredis'
import { GeneratorRedisService } from './redis.service'

@Module({
    providers: [
        {
            provide: 'REDIS_API_GENERATOR_CLIENT',
            useFactory: () => {
                const redisUrl = process.env.REDIS_URL

                if (!redisUrl) throw new Error('Не указан REDIS_URL в env')

                return new Redis(redisUrl)
            }
        },
        GeneratorRedisService
    ],
    exports: ['REDIS_API_GENERATOR_CLIENT', GeneratorRedisService]
})
export class GeneratorRedisModule {}
