import { ApiTags } from '@nestjs/swagger'
import { GeneratorMainDto } from '../../dto/generator/main.dto'

export function applyDecoratorsToController(targetClass: any, options: GeneratorMainDto) {
    if (options.swagger?.apiTag) {
        ApiTags(options.swagger?.apiTag)(targetClass)
    }
}
