import 'reflect-metadata'
import { GeneratorMainDto } from '../dto/generator/main.dto'
import { CrudGeneratorMetadataEnum } from '../enums/metadata.enum'

export function CrudGenerator(options: GeneratorMainDto): ClassDecorator {
    return (target) => {
        Reflect.defineMetadata(CrudGeneratorMetadataEnum.Options, options, target)
    }
}
