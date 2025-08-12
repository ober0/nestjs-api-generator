import { HttpCode, UseGuards } from '@nestjs/common'
import { ApiResponse, ApiOperation, ApiSecurity, ApiBody, ApiParam } from '@nestjs/swagger'
import { GeneratorMainDto } from '../../dto/generator/main.dto'
import { GeneratorGetByPkMethodDto } from '../../dto/generator/get-by-pk.dto'

export function applyGetByPkDecorators(targetClass: any, methodName: string, options: GeneratorMainDto) {
    const method: GeneratorGetByPkMethodDto = options.methods.getByPk
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

    decorators.push(
        ApiParam({
            name: 'pk',
            schema: {
                oneOf: [{ type: 'string' }, { type: 'integer' }]
            }
        })
    )

    decorators.push(HttpCode(method.responseCode ?? 200))

    decorators.push(
        ApiResponse({
            status: method?.responseCode ?? 200,
            type: method?.responseType ?? undefined
        })
    )

    Reflect.decorate(decorators.flat(), targetClass.prototype, methodName, descriptor)
}
