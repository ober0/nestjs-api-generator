import { Global, Module } from '@nestjs/common'
import { PermissionService } from './permission.service'
import { PermissionController } from './permission.controller'
import { PermissionRepository } from './permission.repository'

@Global()
@Module({
    controllers: [PermissionController],
    providers: [PermissionService, PermissionRepository],
    exports: [PermissionService, PermissionRepository]
})
export class PermissionModule {}
