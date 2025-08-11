import { ApiSecurity, ApiTags } from '@nestjs/swagger'
import { GeneratorMainDto } from '../../dto/generator/main.dto'
import { UseGuards } from '@nestjs/common'

export function applyDecoratorsToController(targetClass: any, options: GeneratorMainDto) {
    if (options.swagger?.apiTag) {
        ApiTags(options.swagger?.apiTag)(targetClass)
    }

    if (options.swagger?.apiTag) {
        ApiSecurity(options.swagger?.apiSecurity)(targetClass)
    }

    if (options.guards?.length) {
        UseGuards(...options.guards)(targetClass)
    }
}
