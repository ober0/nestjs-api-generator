import { GeneratorGetAllMethodDto } from './get-all.dto'
import { SwaggerClassDto } from '../swagger/main.dto'
import { OrmEnum } from '../../enums/orm.enum'
import { GeneratorCreateMethodDto } from './create.dto'

export class DbModelsDto {
    /**
     * Имя модули в орм
     */
    model: string
    /**
     * Nested Сервис Бд
     */
    dbService: any
    /**
     * Тип Орм
     */
    orm: OrmEnum
    /**
     * название уникального ключа в таблице (id)
     */
    pk: string
}

export class GeneratorMainDto {
    /**
     * методы круд
     */
    methods: {
        getAll?: GeneratorGetAllMethodDto
        create?: GeneratorCreateMethodDto
    }
    /**
     * Глобальные настройки сваггера
     */
    swagger?: SwaggerClassDto
    /**
     * Базовый путь ко всем ручкам в контроллере
     */
    path: string
    /**
     * Конфигурация БД
     */
    db: DbModelsDto
    /**
     * Используется для генерации типов, при желании в каждом сервисе можно переопределить тип
     */
    baseDto: GeneratorCreateMethodDto
    /**
     * Массив декораторов на контроллере (ТД MethodDecorator)
     */
    customDecorators?: AllowedDecorator[]
}
