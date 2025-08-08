import { CrudGenerator } from '../api-generator/decorators/crud-generator.decorator'
import { JwtAuthGuard } from '../auth/guards/auth.guard'
import { PermissionGuard } from '../role-permission/guards/permission.guard'
import { HasPermissions } from '../role-permission/decorators/permissions.decorator'
import { PermissionEnum } from '../../common/constants/permission.enum'
import { Prisma } from '@prisma/client'
import { OrmEnum } from '../api-generator/enums/orm.enum'
import { PrismaModule } from '../prisma/prisma.module'
import { PrismaService } from '../prisma/prisma.service'
import { TestResponseDto } from './dto/response.dto'

@CrudGenerator({
    path: 'test',
    db: {
        dbService: PrismaService,
        model: Prisma.ModelName.Test,
        orm: OrmEnum.Prisma
    },
    methods: {
        getAll: {
            swagger: {
                summary: 'Get all test',
                responseType: TestResponseDto,
                statusCode: 200,
                apiSecurity: 'bearer'
            },
            guards: [JwtAuthGuard, PermissionGuard],
            customDecorators: [HasPermissions(PermissionEnum.PermissionGetAll)]
        }
    },
    swagger: {
        apiTag: 'Test'
    }
})
export class TestCrud {}
