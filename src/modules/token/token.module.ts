import { Module } from '@nestjs/common'
import { TokenService } from './token.service'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { JwtStrategy } from './strategies/jwt.strategy'
import { PassportModule } from '@nestjs/passport'

@Module({
    imports: [
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                signOptions: { expiresIn: '1d' },
                secret: config.get('ACCESS_SECRET')
            })
        }),
        PassportModule
    ],
    providers: [TokenService, JwtStrategy],
    exports: [TokenService, JwtModule]
})
export class TokenModule {}
