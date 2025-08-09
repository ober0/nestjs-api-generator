import { UseGuards } from '@nestjs/common'
import { ApiResponse, ApiOperation, ApiSecurity } from '@nestjs/swagger'
import { GeneratorMainDto } from '../../dto/generator/main.dto'
import { GeneratorGetAllMethodDto } from '../../dto/generator/get-all.dto'

export function applyGetAllDecorators(targetClass: any, methodName: string, options: GeneratorMainDto) {
    const method: GeneratorGetAllMethodDto = options.methods.getAll
    const descriptor = Object.getOwnPropertyDescriptor(targetClass.prototype, methodName)

    if (!descriptor) {
        throw new Error(`Method "${methodName}" not found in controller "${targetClass.name}".`)
    }

    const decorators: MethodDecorator[] = []

    if (method.guards?.length) {
        decorators.push(UseGuards(...method.guards))
    }

    if (method.swagger?.apiSecurity) {
        decorators.push(ApiSecurity(method.swagger.apiSecurity))
    }

    if (method?.responseType || method.swagger?.statusCode) {
        decorators.push(
            ApiResponse({
                status: method.swagger?.statusCode ?? 200,
                type: method?.responseType ?? undefined
            })
        )
    }

    if (method.swagger?.summary) {
        decorators.push(
            ApiOperation({
                summary: method.swagger.summary
            })
        )
    }

    if (options.customDecorators?.length) {
        for (const decorator of options.customDecorators) {
            if (Array.isArray(decorator)) {
                const [decoratorFn, args] = decorator
                decorators.push(decoratorFn(...args))
            } else {
                decorators.push(decorator)
            }
        }
    }

    Reflect.decorate(decorators.flat(), targetClass.prototype, methodName, descriptor)
}
