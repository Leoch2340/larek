/* Этот код определяет класс Api, который упрощает взаимодействие с API с 
помощью методов GET и POST 
*/

// Импортируем ApiPostMethods 
import { ApiPostMethods } from "../../types";

// Создаём класс для работы с API
export class Api {
    readonly baseUrl: string; // Базовый URL API 
    protected options: RequestInit; // Опции для запросов (например, заголовки)

    // Конструктор класса, принимающий базовый URL и опциональные настройки запросов
    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json', // Устанавливаем заголовок Content-Type по умолчанию
                ...(options.headers as object ?? {}) // Объединяем переданные заголовки с дефолтными
            }
        };
    }

    // Обрабатывает ответ от сервера: если ответ успешный, возвращает JSON, иначе выбрасывает ошибку
    protected handleResponse(response: Response): Promise<object> {
        if (response.ok) return response.json(); // Если статус ответа 200-299, парсим JSON
        else return response.json() // Иначе тоже парсим JSON, но отклоняем промис с ошибкой
            .then(data => Promise.reject(data.error ?? response.statusText));
    }

    // Выполняет GET-запрос
    get(uri: string) {
        return fetch(this.baseUrl + uri, { // Отправляем запрос по указанному URI
            ...this.options, // Добавляем стандартные опции (заголовки)
            method: 'GET' // Указываем метод запроса
        }).then(this.handleResponse); // Обрабатываем ответ
    }

    // Выполняет POST (или другой переданный метод: PUT, PATCH и т. д.)
    post(uri: string, data: object, method: ApiPostMethods = 'POST') {
        return fetch(this.baseUrl + uri, { // Отправляем запрос
            ...this.options, // Добавляем стандартные опции
            method, // Используем переданный метод (по умолчанию 'POST')
            body: JSON.stringify(data) // Преобразуем объект в строку JSON
        }).then(this.handleResponse); // Обрабатываем ответ
    }
}
