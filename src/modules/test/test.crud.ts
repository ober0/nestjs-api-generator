import { CrudGenerator } from '../api-generator/decorators/crud-generator.decorator'
import { JwtAuthGuard } from '../auth/guards/auth.guard'
import { PermissionGuard } from '../role-permission/guards/permission.guard'
import { HasPermissions } from '../role-permission/decorators/permissions.decorator'
import { PermissionEnum } from '../../common/constants/permission.enum'
import { Prisma } from '@prisma/client'
import { OrmEnum } from '../api-generator/enums/orm.enum'
import { PrismaService } from '../prisma/prisma.service'
import { TestBaseDto } from './dto/base.dto'
import { loadCrudModule } from '../api-generator/loader/loader-main'
import { DynamicModule, Module } from '@nestjs/common'

export const TestModuleCfg = {
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
                summary: 'Get all test',
                apiSecurity: 'bearer'
            },
            guards: [JwtAuthGuard, PermissionGuard],
            customDecorators: [HasPermissions(PermissionEnum.PermissionGetAll)]
        },
        create: {
            swagger: {
                summary: 'Create test',
                apiSecurity: 'bearer'
            },
            guards: [JwtAuthGuard, PermissionGuard],
            customDecorators: [HasPermissions(PermissionEnum.PermissionGetAll)]
        }
    },
    swagger: {
        apiTag: 'Test'
    },
    baseDto: TestBaseDto,
    injectServiceToken: 'test123'
}

@CrudGenerator(TestModuleCfg)
export class TestCrud {}

export const TestModuleSchema: DynamicModule = loadCrudModule(TestCrud)

@Module({
    imports: [TestModuleSchema],
    exports: [TestModuleSchema]
})
export class TestModule {}
