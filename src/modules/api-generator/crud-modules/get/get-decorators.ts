import { UseGuards } from '@nestjs/common'
import { ApiTags, ApiResponse, ApiSecurity, ApiOperation } from '@nestjs/swagger'
import { GeneratorMainDto } from '../../dto/generator/main.dto'

export function applyDecoratorsToMethod(targetClass: any, methodName: string, options: GeneratorMainDto) {
    if (options.swagger?.apiTag) {
        ApiTags(options.swagger?.apiTag)(targetClass)
    }

    if (options.get?.guards && options.get?.guards?.length) {
        Reflect.decorate([UseGuards(...options.get?.guards)], targetClass.prototype, methodName, Object.getOwnPropertyDescriptor(targetClass.prototype, methodName))
    }

    if (options.get?.swagger?.apiSecurity) {
        ApiSecurity(options.get?.swagger?.apiSecurity)(targetClass)
    }

    if (options.customDecorators && options.customDecorators.length) {
        for (const decorator of options.customDecorators) {
            if (Array.isArray(decorator)) {
                const [decoratorFn, args] = decorator
                Reflect.decorate([decoratorFn(...args)], targetClass.prototype, methodName, Object.getOwnPropertyDescriptor(targetClass.prototype, methodName))
            } else {
                Reflect.decorate([decorator], targetClass.prototype, methodName, Object.getOwnPropertyDescriptor(targetClass.prototype, methodName))
            }
        }
    }

    if (options.get?.swagger?.responseType || options.get?.swagger?.statusCode) {
        Reflect.decorate(
            [
                ApiResponse({
                    status: options.get?.swagger?.statusCode ?? 200,
                    type: options.get?.swagger?.responseType ?? undefined
                })
            ],
            targetClass.prototype,
            methodName,
            Object.getOwnPropertyDescriptor(targetClass.prototype, methodName)
        )
    }

    if (options.get?.swagger?.summary) {
        Reflect.decorate(
            [
                ApiOperation({
                    summary: options.get?.swagger.summary
                })
            ],
            targetClass.prototype,
            methodName,
            Object.getOwnPropertyDescriptor(targetClass.prototype, methodName)
        )
    }
}
