import { DynamicModule, Type } from '@nestjs/common'
import { GeneratorMainDto } from '../dto/generator/main.dto'
import { createCrudGet } from '../fubrics/crud-create-get.fubric'

export function loadCrudModule(target: Type<any>): DynamicModule {
    const options = Reflect.getMetadata('crud:options', target) as GeneratorMainDto
    return createCrudGet(options)
}
