import { CrudGenerator } from '../api-generator/decorators/crud-generator.decorator'
import { JwtAuthGuard } from '../auth/guards/auth.guard'
import { PermissionGuard } from '../role-permission/guards/permission.guard'
import { UseGuards } from '@nestjs/common'
import { HasPermissions } from '../role-permission/decorators/permissions.decorator'
import { PermissionEnum } from '../../common/constants/permission.enum'

@CrudGenerator({
    path: 'test',
    prismaModel: 'Test',
    get: {
        swagger: {
            summary: 'Get all test',
            statusCode: 200,
            apiSecurity: 'bearer'
        },
        guards: [JwtAuthGuard, PermissionGuard],
        customDecorators: [HasPermissions(PermissionEnum.PermissionGetAll)]
    },
    swagger: {
        apiTag: 'Test'
    }
})
export class TestCrud {}
