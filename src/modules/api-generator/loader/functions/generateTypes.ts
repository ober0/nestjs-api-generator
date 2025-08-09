import { Type } from '@nestjs/common'
import { MethodsEnum } from '../../enums/methods.enum'
import * as fs from 'node:fs'

export function generateTypes(baseDto: Type<any>, method: MethodsEnum): Type<any> | false {
    switch (method) {
        case MethodsEnum.GetAll:
            return false
        case MethodsEnum.Create:
            return baseDto
        default:
            throw new Error(`Указан несуществующий тип метода: ${method}`)
    }
}
