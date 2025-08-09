import { Type } from '@nestjs/common'
import { MethodsEnum } from '../../enums/methods.enum'
import { getAutoFilledFields } from '../../decorators/dto.auto-fill.decorator'
import { GeneratorMainDto } from '../../dto/generator/main.dto'
import { OmitType } from '@nestjs/swagger'

export function generateDtoTypes(options: GeneratorMainDto, method: MethodsEnum, target: Type<any>): Type<any> | false {
    if (!options.baseDto) throw new Error(`Не указан BaseDto для генерации типов в ${target.name} ( функция ${method} )`)
    switch (method) {
        case MethodsEnum.GetAll:
            return false
        case MethodsEnum.Create:
            const excludedFields: string[] = []
            const instance = new options.baseDto()

            // Авто заполняемые поля
            excludedFields.push(...getAutoFilledFields(instance))

            // Уникальный идентификатор
            excludedFields.push(options.db.pk)

            return OmitType(options.baseDto, excludedFields as (keyof InstanceType<typeof options.baseDto>)[])
        default:
            throw new Error(`Указан несуществующий тип метода: ${method}`)
    }
}

export function generateResponseTypes(options: GeneratorMainDto, method: MethodsEnum, target: Type<any>): Type<any> | false {
    if (!options.baseDto) throw new Error(`Не указан BaseDto для генерации типов в ${target.name} ( функция ${method} )`)
    switch (method) {
        case MethodsEnum.GetAll:
        case MethodsEnum.Create:
            return options.baseDto
        default:
            throw new Error(`Указан несуществующий тип метода: ${method}`)
    }
}
