import { CrudGenerator } from '../api-generator/decorators/crud-generator.decorator'
import { JwtAuthGuard } from '../auth/guards/auth.guard'
import { PermissionGuard } from '../role-permission/guards/permission.guard'
import { HasPermissions } from '../role-permission/decorators/permissions.decorator'
import { PermissionEnum } from '../../common/constants/permission.enum'
import { Prisma } from '@prisma/client'
import { OrmEnum } from '../api-generator/enums/orm.enum'
import { PrismaService } from '../prisma/prisma.service'
import { TestResponseDto } from './dto/response.dto'
import { TestCreateDto } from './dto/create.dto'

@CrudGenerator({
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
                statusCode: 200,
                apiSecurity: 'bearer'
            },
            guards: [JwtAuthGuard, PermissionGuard],
            customDecorators: [HasPermissions(PermissionEnum.PermissionGetAll)]
        },
        create: {
            swagger: {
                summary: 'Create test',
                statusCode: 201,
                apiSecurity: 'bearer'
            },
            guards: [JwtAuthGuard, PermissionGuard],
            customDecorators: [HasPermissions(PermissionEnum.PermissionGetAll)],
            dto: TestCreateDto
        }
    },
    swagger: {
        apiTag: 'Test'
    },
    baseDto: {
        dto: TestResponseDto
    }
})
export class TestCrud {}
