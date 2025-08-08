import 'reflect-metadata'
import { GeneratorMainDto } from '../dto/generator/main.dto'

export function CrudGenerator(options: GeneratorMainDto): ClassDecorator {
    return (target) => {
        Reflect.defineMetadata('crud:options', options, target)
    }
}
