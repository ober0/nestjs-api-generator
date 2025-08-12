import { Type, Injectable, Inject, Optional, InternalServerErrorException } from '@nestjs/common'
import { generateModuleToken } from '../../tools/generate-module-token'
import { CrudFileTypeKeys } from '../../enums/file-types.enum'
import { MethodsEnum } from '../../enums/methods.enum'
import { GeneratorMainDto } from '../../dto/generator/main.dto'

export type ICrudCommonServiceType = {
    create?: (dto: any) => Promise<any>
    getAll?: () => Promise<any>
    getByPk?: (pk: any) => Promise<any>
}

export function createCrudCommonService(dto: GeneratorMainDto) {
    type CreateDto = InstanceType<typeof dto.methods.create.dto>
    type CreateResponseDto = InstanceType<typeof dto.methods.create.responseType>
    type GetAllResponseDto = InstanceType<typeof dto.methods.getAll.responseType>
    type GetByPkResponseDto = InstanceType<typeof dto.methods.getByPk.responseType>

    @Injectable()
    class CrudCommonService {
        constructor(
            @Optional()
            @Inject(generateModuleToken({ type: CrudFileTypeKeys.Service, method: MethodsEnum.GetAll, key: dto.path }))
            readonly getAllService?: any,

            @Optional()
            @Inject(generateModuleToken({ type: CrudFileTypeKeys.Service, method: MethodsEnum.Create, key: dto.path }))
            readonly createService?: any,

            @Optional()
            @Inject(generateModuleToken({ type: CrudFileTypeKeys.Service, method: MethodsEnum.GetByPk, key: dto.path }))
            readonly getByPkService?: any
        ) {}
    }

    if (dto.methods.create) {
        ;(CrudCommonService.prototype as any).create = async function (dto: CreateDto): Promise<CreateResponseDto> {
            return this.createService.create(dto)
        }
    } else {
        ;(CrudCommonService.prototype as any).create = async function (): Promise<never> {
            throw new InternalServerErrorException(`Метод create в ${dto.path} не реализован`)
        }
    }

    if (dto.methods.getAll) {
        ;(CrudCommonService.prototype as any).getAll = async function (): Promise<GetAllResponseDto> {
            return this.getAllService.getAll()
        }
    } else {
        ;(CrudCommonService.prototype as any).getAll = async function (): Promise<never> {
            throw new InternalServerErrorException(`Метод getAll в ${dto.path} не реализован`)
        }
    }

    if (dto.methods.getByPk) {
        ;(CrudCommonService.prototype as any).getByPk = async function (pk: any): Promise<GetByPkResponseDto> {
            return this.getByPk.getByPk(pk)
        }
    } else {
        ;(CrudCommonService.prototype as any).getByPk = async function (): Promise<never> {
            throw new InternalServerErrorException(`Метод getByPk в ${dto.path} не реализован`)
        }
    }

    return CrudCommonService
}
