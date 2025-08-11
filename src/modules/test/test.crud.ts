import { CrudGenerator } from '../api-generator/decorators/crud-generator.decorator'
import { JwtAuthGuard } from '../auth/guards/auth.guard'
import { PermissionGuard } from '../role-permission/guards/permission.guard'
import { HasPermissions } from '../role-permission/decorators/permissions.decorator'
import { PermissionEnum } from '../../common/constants/permission.enum'
import { Prisma } from '@prisma/client'
import { OrmEnum } from '../api-generator/enums/orm.enum'
import { PrismaService } from '../prisma/prisma.service'
import { TestBaseDto } from './dto/base.dto'
import { createCrud } from '../api-generator/fubrics/crud-create.fubric'
import { loadCrudModule } from '../api-generator/loader/loader-main'
import { DynamicModule, Module } from '@nestjs/common'
import { GeneratorMainDto } from '../api-generator/dto/generator/main.dto'
import { ActiveGuard } from '../auth/guards/active.guard'

export const TestModuleCfg: GeneratorMainDto = {
    path: 'test',
    db: {
        dbService: PrismaService,
        model: Prisma.ModelName.Test,
        orm: OrmEnum.Prisma,
        pk: 'id'
    },
    methods: {
        getAll: {
            swagger: {
                summary: 'Get all test'
            },
            customDecorators: [HasPermissions(PermissionEnum.PermissionGetAll)]
        },
        create: {
            swagger: {
                summary: 'Create test'
            },
            guards: [ActiveGuard],
            customDecorators: [HasPermissions(PermissionEnum.PermissionGetAll)]
        }
    },
    swagger: {
        apiTag: 'Test',
        apiSecurity: 'bearer'
    },
    baseDto: TestBaseDto,
    injectServiceToken: 'test123',
    cache: {
        ttl: 3600
    },
    guards: [JwtAuthGuard, PermissionGuard]
}

@CrudGenerator(TestModuleCfg)
export class TestCrud {}

export const TestModuleSchema: DynamicModule = loadCrudModule(TestCrud)

@Module({
    imports: [TestModuleSchema],
    exports: [TestModuleSchema]
})
export class TestModule {}
