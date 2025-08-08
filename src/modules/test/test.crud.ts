import { CrudGenerator } from '../api-generator/decorators/crud-generator.decorator'
import { JwtAuthGuard } from '../auth/guards/auth.guard'

@CrudGenerator({
    path: 'test',
    prismaModel: 'Test',
    get: {
        swagger: {
            summary: 'Get all test',
            statusCode: 200,
            apiSecurity: 'bearer'
        },
        guards: [new JwtAuthGuard()]
    },
    swagger: {
        apiTag: 'Test'
    }
})
export class TestCrud {}
