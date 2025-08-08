import { ApiTags, ApiResponse, ApiSecurity, ApiOperation } from '@nestjs/swagger'
import { GeneratorMainDto } from '../../dto/generator/main.dto'

export function applyDecoratorsToController(targetClass: any, options: GeneratorMainDto) {
    if (options.swagger?.apiTag) {
        ApiTags(options.swagger?.apiTag)(targetClass)
    }

    if (options.get?.swagger?.apiSecurity) {
        ApiSecurity(options.get?.swagger?.apiSecurity)(targetClass)
    }
}
