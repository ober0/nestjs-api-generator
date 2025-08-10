import { CrudFileTypeKeys } from '../enums/file-types.enum'
import { MethodsEnum } from '../enums/methods.enum'

export function generateModuleToken({ type, method, key }: { type: CrudFileTypeKeys; method: MethodsEnum; key: string }) {
    return `crud_${type}_${method}_${key}`
}
