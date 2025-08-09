import { DynamicModule, Type } from '@nestjs/common'
import { GeneratorMainDto } from '../dto/generator/main.dto'
import { createCrud } from '../fubrics/crud-create.fubric'
import { CrudGeneratorMetadataEnum } from '../enums/metadata.enum'
import { MethodsEnum } from '../enums/methods.enum'
import { generateDtoTypes, generateResponseTypes } from './functions/generate-types'

export function loadCrudModule(target: Type<any>): DynamicModule {
    let options: GeneratorMainDto = Reflect.getMetadata(CrudGeneratorMetadataEnum.Options, target) as GeneratorMainDto

    Object.keys(options.methods).forEach((method: MethodsEnum) => {
        if (!Object.keys(options.methods[method]).includes('dto')) {
            const dto: false | Type<any> = generateDtoTypes(options, method, target)
            if (dto) {
                ;(options.methods[method] as any).dto = dto
            }
        }
    })

    Object.keys(options.methods).forEach((method: MethodsEnum) => {
        if (!Object.keys(options.methods[method]).includes('responseType')) {
            const dto: false | Type<any> = generateResponseTypes(options, method, target)
            if (dto) {
                options.methods[method].responseType = dto
            }
        }
    })
    return createCrud(options)
}
