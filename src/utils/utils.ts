/* 
Этот набор функций содержит помощники для работы с DOM, обработку различных типов 
данных и утилиты для преобразования данных в удобные форматы, такие как PascalCase в 
kebab-case.
*/

// Функция преобразует строку из PascalCase в kebab-case
export function pascalToKebab(value: string): string {
    return value.replace(/([a-z0–9])([A-Z])/g, "$1-$2").toLowerCase();
}

// Функция проверяет, является ли переданный аргумент строкой-селектором
export function isSelector(x: any): x is string {
    return (typeof x === "string") && x.length > 1;
}

// Функция проверяет, является ли значение пустым (null или undefined)
export function isEmpty(value: any): boolean {
    return value === null || value === undefined;
}

// Тип, представляющий коллекцию селекторов (строка, список элементов или массив)
export type SelectorCollection<T> = string | NodeListOf<Element> | T[];

// Функция получает все элементы по переданному селектору
export function ensureAllElements<T extends HTMLElement>(
    selectorElement: SelectorCollection<T>, 
    context: HTMLElement = document as unknown as HTMLElement
): T[] {
    if (isSelector(selectorElement)) {
        // Если передан строковый селектор, ищем все соответствующие элементы в контексте
        return Array.from(context.querySelectorAll(selectorElement)) as T[];
    }
    if (selectorElement instanceof NodeList) {
        // Если передан NodeList, преобразуем его в массив
        return Array.from(selectorElement) as T[];
    }
    if (Array.isArray(selectorElement)) {
        // Если передан массив, возвращаем его как есть
        return selectorElement;
    }
    throw new Error(`Unknown selector element`);
}

// Тип, представляющий один элемент или строку-селектор
export type SelectorElement<T> = T | string;

// Функция получает один элемент по селектору, выбрасывает ошибку, если найдено несколько или ни одного
export function ensureElement<T extends HTMLElement>(
    selectorElement: SelectorElement<T>, 
    context?: HTMLElement
): T {
    if (isSelector(selectorElement)) {
        // Если передан селектор, получаем все элементы
        const elements = ensureAllElements<T>(selectorElement, context);
        if (elements.length > 1) {
            console.warn(`selector ${selectorElement} return more than one element`);
        }
        if (elements.length === 0) {
            throw new Error(`selector ${selectorElement} return nothing`);
        }
        return elements.pop() as T; // Возвращаем последний элемент
    }
    if (selectorElement instanceof HTMLElement) {
        // Если передан сам элемент, возвращаем его
        return selectorElement as T;
    }
    throw new Error('Unknown selector element');
}

// Функция клонирует содержимое HTML-шаблона
export function cloneTemplate<T extends HTMLElement>(query: string | HTMLTemplateElement): T {
    const template = ensureElement(query) as HTMLTemplateElement;
    return template.content.firstElementChild.cloneNode(true) as T;
}

// Функция для работы с BEM-именованием классов
export function bem(block: string, element?: string, modifier?: string): { name: string, class: string } {
    let name = block;
    if (element) name += `__${element}`;
    if (modifier) name += `_${modifier}`;
    return {
        name,
        class: `.${name}`
    };
}

// Функция получает список свойств объекта, фильтруя их
export function getObjectProperties(
    obj: object, 
    filter?: (name: string, prop: PropertyDescriptor) => boolean
): string[] {
    return Object.entries(
        Object.getOwnPropertyDescriptors(
            Object.getPrototypeOf(obj)
        )
    )
    .filter(([name, prop]) => filter ? filter(name, prop) : (name !== 'constructor'))
    .map(([name]) => name);
}

/**
 * Устанавливает dataset-атрибуты элемента
 */
export function setElementData<T extends Record<string, unknown> | object>(el: HTMLElement, data: T) {
    for (const key in data) {
        el.dataset[key] = String(data[key]);
    }
}

/**
 * Получает типизированные данные из dataset-атрибутов элемента
 */
export function getElementData<T extends Record<string, unknown>>(
    el: HTMLElement, 
    scheme: Record<string, Function>
): T {
    const data: Partial<T> = {};
    for (const key in el.dataset) {
        data[key as keyof T] = scheme[key](el.dataset[key]);
    }
    return data as T;
}

/**
 * Проверка на простой объект ({} или null-прототип)
 */
export function isPlainObject(obj: unknown): obj is object {
    const prototype = Object.getPrototypeOf(obj);
    return prototype === Object.getPrototypeOf({}) || prototype === null;
}

// Функция проверяет, является ли значение булевым
export function isBoolean(v: unknown): v is boolean {
    return typeof v === 'boolean';
}

/**
 * Фабрика DOM-элементов (упрощённая версия)
 */
export function createElement<
    T extends HTMLElement
>(
    tagName: keyof HTMLElementTagNameMap,
    props?: Partial<Record<keyof T, string | boolean | object>>,
    children?: HTMLElement | HTMLElement[]
): T {
    const element = document.createElement(tagName) as T;
    if (props) {
        for (const key in props) {
            const value = props[key];
            if (isPlainObject(value) && key === 'dataset') {
                // Если свойство dataset, записываем его через setElementData
                setElementData(element, value);
            } else {
                // @ts-expect-error fix indexing later
                element[key] = isBoolean(value) ? value : String(value);
            }
        }
    }
    if (children) {
        // Добавляем дочерние элементы
        for (const child of Array.isArray(children) ? children : [children]) {
            element.append(child);
        }
    }
    return element;
}
