import 'reflect-metadata'
import { CrudGeneratorMetadataEnum } from '../enums/metadata.enum'

const MY_CUSTOM_DECORATOR_KEY = CrudGeneratorMetadataEnum.AutoFill

export function AutoFill() {
    return function (target: any, propertyKey: string) {
        const existingFields: string[] = Reflect.getMetadata(MY_CUSTOM_DECORATOR_KEY, target) || []
        Reflect.defineMetadata(MY_CUSTOM_DECORATOR_KEY, [...existingFields, propertyKey], target)
    }
}

export function getAutoFilledFields(dtoInstance: any): string[] {
    return Reflect.getMetadata(MY_CUSTOM_DECORATOR_KEY, Object.getPrototypeOf(dtoInstance)) || []
}
