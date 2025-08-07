import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { PasswordService } from '../password/password.service'
import { TokenService } from '../token/token.service'
import { RedisService } from '../redis/redis.service'
import { SmtpService } from '../smtp/smtp.service'
import { UserRepository } from '../user/user.repository'
import { createHash, randomBytes } from 'crypto'
import { ChangePasswordNoAuthDto, ConfirmChangePasswordDto, ConfirmSignUpUserDto, ResendConfirmCodeDto, SignInUserDto, SignUpResponseUserDto, SignUpUserDto } from './dto'
import { UserService } from '../user/user.service'
import { I18nService } from 'nestjs-i18n'
import { getCurrentLang } from '../../i18n/utils'
import { LoginHistoryService } from '../login-history/login-history.service'
import { LoginHistoryBaseDto } from '../login-history/dto/login-history-base.dto'

@Injectable()
export class AuthService {
    private readonly logger = new Logger('AuthService')

    constructor(
        private readonly tokenService: TokenService,
        private readonly passwordService: PasswordService,
        private readonly redis: RedisService,
        private readonly smtpService: SmtpService,
        private readonly userRepository: UserRepository,
        private readonly userService: UserService,
        private readonly i18n: I18nService,
        private readonly loginHistoryService: LoginHistoryService
    ) {}

    private generateVerificationCode(): number {
        return Math.floor(100000 + Math.random() * 900000)
    }

    private async generateHash(length: number = 16): Promise<string> {
        const randomData: string = randomBytes(32).toString('hex')
        const hash: string = createHash('sha256').update(randomData).digest('hex')
        return hash.substring(0, length)
    }

    private async ensureUserByEmail(email: string) {
        const user = await this.userRepository.findOneByEmail(email)
        if (user) {
            throw new ConflictException(
                this.i18n.t('errors.user.already_exists', {
                    lang: getCurrentLang()
                })
            )
        }
    }

    async signUp(userDto: SignUpUserDto) {
        const email = userDto.email
        const password = userDto.password

        const [, code, hash] = await Promise.all([this.ensureUserByEmail(email), this.generateVerificationCode(), this.generateHash(), this.passwordService.validate(password)])

        const userData = JSON.stringify({ ...userDto, code })

        await this.redis.set(`signup-${hash}`, userData, 300)

        await this.smtpService.send(email, `Ваш код подтверждения: ${code}`, 'Код для подтверждения создания аккаунта')
        console.log(code)
        return {
            msg: 'Код отправляется',
            hash
        } satisfies SignUpResponseUserDto
    }

    async confirmSignUp({ hash, code: inputCode }: ConfirmSignUpUserDto) {
        const redisKey = `signup-${hash}`
        const cachedData = await this.redis.get(redisKey)

        if (!cachedData || typeof cachedData !== 'string') {
            throw new NotFoundException(
                this.i18n.t('errors.auth.confirm.timeout', {
                    lang: getCurrentLang()
                })
            )
        }

        const parsedData = JSON.parse(cachedData)
        const { code: expectedCode, ...rawUserDto } = parsedData

        if (Number(expectedCode) !== inputCode) {
            throw new BadRequestException(
                this.i18n.t('errors.auth.confirm.incorrect_code', {
                    lang: getCurrentLang()
                })
            )
        }

        if (await this.userRepository.existsByEmail(rawUserDto.email)) {
            throw new ConflictException(
                this.i18n.t('errors.user.already_exists', {
                    lang: getCurrentLang()
                })
            )
        }

        const [, { id, email }] = await Promise.all([this.redis.del(redisKey), this.userService.create(rawUserDto)])

        this.logger.log(`Пользователь ${email} успешно зарегистрирован`)

        const [accessToken, refreshToken] = await Promise.all([this.tokenService.generateAccessToken(id, email), this.tokenService.generateRefreshToken(id, email)])

        return {
            accessToken,
            refreshToken
        }
    }

    async resendConfirmCode({ hash, action }: ResendConfirmCodeDto) {
        const actions = {
            signin: { key: `signin-${hash}`, subject: 'Код для подтверждения входа в аккаунт' },
            signup: { key: `signup-${hash}`, subject: 'Код для подтверждения регистрации' },
            'change-password-no-auth': {
                key: `changePasswordNoAuth-${hash}`,
                subject: 'Код подтверждения для смены пароля в аккаунте Gravitino Terminal'
            },
            twoFactor: {
                key: `twoFactor-${hash}`,
                subject: 'Код для изменения 2FA аккаунта Gravitino Terminal'
            }
        }

        const actionMeta = actions[action]
        if (!actionMeta) {
            throw new BadRequestException('Неверное действие')
        }

        const cachedData = await this.redis.get(actionMeta.key)
        if (!cachedData || typeof cachedData !== 'string') {
            throw new BadRequestException(
                this.i18n.t('errors.auth.confirm.timeout', {
                    lang: getCurrentLang()
                })
            )
        }

        const parsed = JSON.parse(cachedData)
        const newCode = this.generateVerificationCode()
        const updatedData = JSON.stringify({ ...parsed, code: newCode })

        await this.redis.set(actionMeta.key, updatedData, 300)
        await this.smtpService.send(parsed.email, `Ваш код подтверждения: ${newCode}`, actionMeta.subject)

        return { msg: 'Код отправляется', hash }
    }

    async signIn({ email, password, fingerprint }: SignInUserDto, info: LoginHistoryBaseDto) {
        const ip = info.ip

        const attemptsKey = await this.checkSignInAttempts(ip)

        const user = await this.userService.findOneByEmail(email, true)

        const isValid = await this.passwordService.comparePassword(password, user.password.password)
        if (!isValid) {
            await this.redis.incrementWithTTL(attemptsKey, 1, 600)
            throw new NotFoundException(
                this.i18n.t('errors.user.not_found', {
                    lang: getCurrentLang()
                })
            )
        }

        if (!user.twoFactor) {
            await this.loginHistoryService.create({
                userId: user.id,
                ...info,
                fingerprint
            })

            return {
                accessToken: await this.tokenService.generateAccessToken(user.id, user.email),
                refreshToken: await this.tokenService.generateRefreshToken(user.id, user.email),
                user
            }
        }

        const code = this.generateVerificationCode()
        const hash = await this.generateHash()
        const payload = JSON.stringify({ id: user.id, email: user.email, code })

        await this.redis.set(`signin-${hash}`, payload, 300)
        await this.smtpService.send(email, `Ваш код подтверждения: ${code}`, 'Код для подтверждения входа в аккаунт')

        return { msg: 'Код отправляется', hash }
    }

    async confirmSignIn({ hash, code: inputCode, fingerprint }: ConfirmSignUpUserDto, info: LoginHistoryBaseDto) {
        const ip = info.ip
        await this.checkConfirmAttempts(ip)

        const redisKey = `signin-${hash}`
        const cachedData = await this.redis.get(redisKey)

        if (!cachedData || typeof cachedData !== 'string') {
            throw new BadRequestException(
                this.i18n.t('errors.auth.confirm.timeout', {
                    lang: getCurrentLang()
                })
            )
        }

        const { id, email, code: expectedCode } = JSON.parse(cachedData)

        if (Number(expectedCode) !== inputCode) {
            await this.redis.incrementWithTTL(`confirm-attempts-${ip}`, 1, 600)
            throw new BadRequestException(
                this.i18n.t('errors.auth.confirm.incorrect_code', {
                    lang: getCurrentLang()
                })
            )
        }

        await this.redis.del(redisKey)

        const user = await this.userService.findOneById(id, false)

        this.logger.log(`Пользователь ${email} выполнил вход`)

        await this.loginHistoryService.create({
            userId: user.id,
            ...info,
            fingerprint
        })

        return {
            accessToken: await this.tokenService.generateAccessToken(user.id, user.email),
            refreshToken: await this.tokenService.generateRefreshToken(user.id, user.email),
            user
        }
    }

    async refresh(refreshToken: string) {
        const { id, email } = await this.tokenService.verifyRefreshToken(refreshToken)

        this.logger.log(`Пользователь ${email} получил новый access-token`)

        return {
            accessToken: await this.tokenService.generateAccessToken(id, email),
            refreshToken: await this.tokenService.generateRefreshToken(id, email)
        }
    }

    async changePassword({ email, password }: ChangePasswordNoAuthDto) {
        const code = this.generateVerificationCode()
        const hash = await this.generateHash()

        const user = await this.userService.findOneByEmail(email)
        const hashedPassword = await this.passwordService.hashPassword(password)

        const data = JSON.stringify({
            id: user.id,
            email: user.email,
            password_hash: hashedPassword,
            code
        })

        await this.redis.set(`changePasswordNoAuth-${hash}`, data, 300)
        await this.smtpService.send(email, `Ваш код подтверждения: ${code}`, 'Код подтверждения для смены пароля')

        return { msg: 'Код отправляется', hash }
    }

    async confirmChangePassword(ip: string, { hash, code: inputCode }: ConfirmChangePasswordDto) {
        await this.checkConfirmAttempts(ip)

        const redisKey = `changePasswordNoAuth-${hash}`
        const cachedData = await this.redis.get(redisKey)

        if (!cachedData || typeof cachedData !== 'string') {
            throw new BadRequestException(
                this.i18n.t('errors.auth.confirm.timeout', {
                    lang: getCurrentLang()
                })
            )
        }

        const { id, password_hash, code: expectedCode } = JSON.parse(cachedData)

        if (Number(expectedCode) !== inputCode) {
            await this.redis.incrementWithTTL(`confirm-attempts-${ip}`, 1, 600)
            throw new BadRequestException(
                this.i18n.t('errors.auth.confirm.incorrect_code', {
                    lang: getCurrentLang()
                })
            )
        }

        return this.userRepository.updatePassword(id, password_hash)
    }

    private async checkConfirmAttempts(ip: string) {
        const attempts = Number(await this.redis.get(`confirm-attempts-${ip}`)) || 0
        if (attempts >= 5) {
            throw new BadRequestException(
                this.i18n.t('errors.auth.many_attempts', {
                    lang: getCurrentLang()
                })
            )
        }
    }

    private async checkSignInAttempts(ip: string) {
        const attemptsKey = `signin-attempts-${ip}`
        const attempts = Number(await this.redis.get(attemptsKey)) || 0

        if (attempts >= 5) {
            throw new BadRequestException(
                this.i18n.t('errors.auth.many_attempts', {
                    lang: getCurrentLang()
                })
            )
        }
        return attemptsKey
    }
}
