import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class GeneratorLoggerMiddleware implements NestMiddleware {
    private logger = new Logger('Generator Http')

    use(req: Request, res: Response, next: NextFunction) {
        const start = Date.now()

        this.logger.debug(`[${req.method}] START ${req.originalUrl}`)
        res.on('finish', () => {
            const duration = Date.now() - start
            this.logger.debug(`[${req.method}] END ${req.originalUrl} ${res.statusCode} ${duration}ms`)
        })

        next()
    }
}
