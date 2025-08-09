import { DynamicModule, Type } from '@nestjs/common'
import { GeneratorMainDto } from '../dto/generator/main.dto'
import { createCrud } from '../fubrics/crud-create.fubric'
import { CrudGeneratorMetadataEnum } from '../enums/metadata.enum'
import { MethodsEnum } from '../enums/methods.enum'
import { generateTypes } from './functions/generate-types'

export function loadCrudModule(target: Type<any>): DynamicModule {
    let options: GeneratorMainDto = Reflect.getMetadata(CrudGeneratorMetadataEnum.Options, target) as GeneratorMainDto

    Object.keys(options.methods).forEach((method: MethodsEnum) => {
        if (!Object.keys(options.methods[method]).includes('dto')) {
            if (!options.baseDto) throw new Error(`Не указан BaseDto для генерации типов в ${target.name} ( функция ${method} )`)
            const dto: false | Type<any> = generateTypes(options, method)
            if (dto) {
                ;(options.methods[method] as any).dto = dto
            }
        }
    })
    return createCrud(options)
}
