/**
 * Базовый компонент
 */
export abstract class Component<T> {
    // Конструктор принимает контейнер — корневой элемент компонента
    protected constructor(protected readonly container: HTMLElement) {
        // Важно: код в конструкторе выполняется ДО объявления свойств в дочернем классе!
    }

    // --- Инструменты для работы с DOM ---

    /**
     * Переключает класс у элемента (можно передавать `force` для управления состоянием)
     */
    toggleClass(element: HTMLElement, className: string, force?: boolean) {
        element.classList.toggle(className, force);
    }

    /**
     * Устанавливает текстовое содержимое элемента
     */
    protected setText(element: HTMLElement, value: unknown) {
        if (element) {
            element.textContent = String(value); // Преобразуем любое значение в строку
        }
    }

    /**
     * Устанавливает/снимает атрибут `disabled`
     */
    setDisabled(element: HTMLElement, state: boolean) {
        if (element) {
            if (state) element.setAttribute('disabled', 'disabled');
            else element.removeAttribute('disabled');
        }
    }

    /**
     * Скрывает элемент (устанавливает `display: none`)
     */
    protected setHidden(element: HTMLElement) {
        element.style.display = 'none';
    }

    /**
     * Делает элемент видимым (убирает `display: none`)
     */
    protected setVisible(element: HTMLElement) {
        element.style.removeProperty('display'); // Удаляет свойство display
    }

    /**
     * Устанавливает изображение (`src`) и альтернативный текст (`alt`)
     */
    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }

    /**
     * Рендерит компонент: обновляет данные и возвращает корневой `HTMLElement`
     */
    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {}); // Применяем переданные данные
        return this.container; // Возвращаем корневой элемент компонента
    }
}
