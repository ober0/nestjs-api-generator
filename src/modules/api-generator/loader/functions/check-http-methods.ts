import { GeneratorMainDto } from '../../dto/generator/main.dto'
import { Type } from '@nestjs/common'
import { MethodsEnum } from '../../enums/methods.enum'

enum HttpMethods {
    Post = 'Post',
    Put = 'Put',
    Delete = 'Delete',
    Patch = 'Patch',
    Get = 'Get'
}

export function checkHttpPathErrors(data: GeneratorMainDto, target: Type<any>) {
    const allPath: { path: string; method: HttpMethods }[] = []

    Object.keys(data.methods).forEach((methodName) => {
        const methodPath = data.methods[methodName]?.path ?? null
        switch (methodName) {
            case MethodsEnum.GetByPk:
                allPath.push({
                    path: methodPath ? `${methodPath}/ANY` : 'ANY',
                    method: HttpMethods.Get
                })
                break
            case MethodsEnum.GetAll:
                allPath.push({
                    path: methodPath ?? '',
                    method: HttpMethods.Get
                })
                break
            case MethodsEnum.Create:
                allPath.push({
                    path: methodPath ?? '',
                    method: HttpMethods.Post
                })
                break
        }
    })
    for (let i = 0; i < allPath.length; i++) {
        for (let j = i + 1; j < allPath.length; j++) {
            const a = allPath[i]
            const b = allPath[j]

            if (a.method !== b.method) continue

            const aParts = a.path.split('/').filter(Boolean)
            const bParts = b.path.split('/').filter(Boolean)

            if (aParts.length !== bParts.length) continue

            const conflict = aParts.every((part, idx) => part === 'ANY' || bParts[idx] === 'ANY' || part === bParts[idx])

            if (conflict && aParts.some((part, idx) => (part === 'ANY' && bParts[idx] !== 'ANY') || (bParts[idx] === 'ANY' && part !== 'ANY'))) {
                throw new Error(`Конфликт путей: "${a.path}" и "${b.path}" для метода ${a.method} в ${target}`)
            }
        }
    }
}
