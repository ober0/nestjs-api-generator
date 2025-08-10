import { Type, Injectable, Inject, Optional } from '@nestjs/common'
import { generateModuleToken } from '../../tools/generate-module-token'
import { CrudFileTypeKeys } from '../../enums/file-types.enum'
import { MethodsEnum } from '../../enums/methods.enum'
import { GeneratorMainDto } from '../../dto/generator/main.dto'
import { GeneratorCreateMethodDto } from '../../dto/generator/create.dto'
import { GeneratorGetAllMethodDto } from '../../dto/generator/get-all.dto'

type CrudServiceInterface<M extends GeneratorMainDto> = {
    create: M['methods']['create'] extends GeneratorCreateMethodDto ? (dto: M['methods']['create']['dto']) => Promise<M['methods']['create']['responseType']> : never
    getAll: M['methods']['getAll'] extends GeneratorGetAllMethodDto ? () => Promise<M['methods']['getAll']['responseType']> : never
}

export function createCrudCommonService<M extends GeneratorMainDto>(dto: GeneratorMainDto): Type<CrudServiceInterface<M>> {
    type CreateDto = InstanceType<typeof dto.methods.create.dto>
    type CreateResponseDto = InstanceType<typeof dto.methods.create.responseType>
    type GetAllResponseDto = InstanceType<typeof dto.methods.getAll.responseType>

    @Injectable()
    class CrudCommonService {
        constructor(
            @Optional()
            @Inject(generateModuleToken({ type: CrudFileTypeKeys.Service, method: MethodsEnum.GetAll, key: dto.path }))
            private readonly getAllService?: any,

            @Optional()
            @Inject(generateModuleToken({ type: CrudFileTypeKeys.Service, method: MethodsEnum.Create, key: dto.path }))
            private readonly createService?: any
        ) {}
    }

    if (dto.methods.create) {
        ;(CrudCommonService.prototype as any).create = async function (dto: CreateDto): Promise<CreateResponseDto> {
            return this.createService.create(dto)
        }
    }

    if (dto.methods.getAll) {
        ;(CrudCommonService.prototype as any).getAll = async function (): Promise<GetAllResponseDto> {
            return this.getAllService.getAll()
        }
    }

    return CrudCommonService as Type<CrudServiceInterface<M>>
}
