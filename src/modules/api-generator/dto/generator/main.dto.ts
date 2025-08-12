import { GeneratorGetAllMethodDto } from './get-all.dto'
import { SwaggerClassDto } from '../swagger/main.dto'
import { OrmEnum } from '../../enums/orm.enum'
import { GeneratorCreateMethodDto } from './create.dto'
import { CanActivate, Type } from '@nestjs/common'
import { GeneratorGetByPkMethodDto } from './get-by-pk.dto'

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
        getByPk?: GeneratorGetByPkMethodDto
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
     * Используется для генерации типов
     */
    baseDto?: Type<any>
    /**
     * Массив декораторов на контроллере (ТД MethodDecorator)
     */
    customDecorators?: AllowedDecorator[]
    /**
     * Токен для инжекта сервиса в другие модули
     */
    injectServiceToken?: string
    /**
     * Гуарды на каждой ручке
     */
    guards?: Type<CanActivate>[]
    /**
     * Необходимо ли кеширование
     */
    cache?:
        | {
              ttl: number
          }
        | boolean
    /**
     * true чтобы отключить логирование
     */
    disableLogger?: true
}
