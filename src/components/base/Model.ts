// Импортируем интерфейс IEvents для работы с событиями
import { IEvents } from "../../types";

/**
 * Гарда (type guard) для проверки, является ли объект экземпляром Model
 * @param obj - проверяемый объект
 * @returns true, если объект является экземпляром Model
 */
export const isModel = (obj: unknown): obj is Model<any> => {
    return obj instanceof Model;
};

/**
 * Абстрактный класс Model, от которого наследуются конкретные модели данных
 * Позволяет отличать модели от обычных объектов и работать с событиями
 */
export abstract class Model<T> {
    /**
     * Конструктор принимает частичные данные модели и объект событий
     * @param data - частичные данные модели
     * @param events - объект для работы с событиями
     */
    constructor(data: Partial<T>, protected events: IEvents) {
        // Копируем переданные данные в текущий экземпляр модели
        Object.assign(this, data);
    }

    /**
     * Метод для уведомления об изменениях в модели
     * @param event - название события
     * @param payload - дополнительные данные (опционально)
     */
    emitChanges(event: string, payload?: object) {
        // Вызываем emit для уведомления подписчиков об изменениях
        this.events.emit(event, payload ?? {});
    }

    // В будущем сюда можно добавить общие методы для всех моделей
}
