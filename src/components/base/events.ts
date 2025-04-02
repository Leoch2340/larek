/* 
Этот код представляет собой класс EventEmitter, реализующий механизм подписки и 
обработки событий.
*/

// Импортируем типы, используемые в EventEmitter
import { EventName, Subscriber, EmitterEvent, IEvents } from "../../types";

/**
 * Брокер событий, классическая реализация
 * В расширенных вариантах есть возможность подписаться на все события
 * или слушать события по шаблону например
 */
export class EventEmitter implements IEvents {
    // Хранит список событий и их обработчиков
    _events: Map<EventName, Set<Subscriber>>;

    constructor() {
        // Инициализируем пустой Map для хранения событий
        this._events = new Map<EventName, Set<Subscriber>>();
    }

    /**
     * Установить обработчик на событие
     * @param eventName - имя события
     * @param callback - функция, вызываемая при возникновении события
     */
    on<T extends object>(eventName: EventName, callback: (event: T) => void) {
        // Если события с таким именем еще нет, создаем новый Set для обработчиков
        if (!this._events.has(eventName)) {
            this._events.set(eventName, new Set<Subscriber>());
        }
        // Добавляем обработчик в список подписчиков на это событие
        this._events.get(eventName)?.add(callback);
    }

    /**
     * Снять обработчик с события
     * @param eventName - имя события
     * @param callback - функция, которую нужно удалить из подписчиков
     */
    off(eventName: EventName, callback: Subscriber) {
        // Проверяем, есть ли обработчики для данного события
        if (this._events.has(eventName)) {
            // Удаляем переданный обработчик из множества подписчиков
            this._events.get(eventName)!.delete(callback);
            // Если обработчиков не осталось, удаляем событие из Map
            if (this._events.get(eventName)?.size === 0) {
                this._events.delete(eventName);
            }
        }
    }

    /**
     * Инициировать событие с данными
     * @param eventName - имя события
     * @param data - данные, передаваемые обработчикам события
     */
    emit<T extends object>(eventName: string, data?: T) {
        // Проходим по всем зарегистрированным событиям
        this._events.forEach((subscribers, name) => {
            // Если имя события совпадает или соответствует шаблону (RegExp)
            if (name instanceof RegExp && name.test(eventName) || name === eventName) {
                // Вызываем все обработчики, подписанные на это событие
                subscribers.forEach(callback => callback(data));
            }
        });
    }

    /**
     * Слушать все события
     * @param callback - функция, вызываемая при любом событии
     */
    onAll(callback: (event: EmitterEvent) => void) {
        // Подписываемся на все события, используя "*"
        this.on("*", callback);
    }

    /**
     * Сбросить все обработчики
     */
    offAll() {
        // Очищаем Map, удаляя все события и их обработчики
        this._events = new Map<string, Set<Subscriber>>();
    }

    /**
     * Сделать коллбек триггером, генерирующим событие при вызове
     * @param eventName - имя события, которое будет сгенерировано
     * @param context - дополнительные данные, добавляемые в событие
     * @returns Функция, вызывающая emit при вызове
     */
    trigger<T extends object>(eventName: string, context?: Partial<T>) {
        return (event: object = {}) => {
            // При вызове функции создаем событие и объединяем переданные данные
            this.emit(eventName, {
                ...(event || {}), // Данные переданные при вызове триггера
                ...(context || {}) // Контекст, переданный при создании триггера
            });
        };
    }
}
