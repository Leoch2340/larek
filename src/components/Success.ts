// Импортируем базовый класс Component
import {Component} from "./base/Component";

// Импортируем утилиту для поиска элементов
import {ensureElement} from "./../utils/utils";

// Импортируем интерфейсы ISuccess и ISuccessActions
import { ISuccess, ISuccessActions } from "../types";

// Определяем класс Success, наследующийся от Component с типом ISuccess
export class Success extends Component<ISuccess> {
    // Поля для хранения ссылок на элементы модального окна успешного заказа
    protected _close: HTMLElement; // Кнопка закрытия
    protected _total: HTMLElement; // Элемент для отображения списанных "синапсов"

    // Конструктор принимает контейнер и объект с действиями (обработчиками событий)
    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container); // Вызываем конструктор родительского класса

        // Находим элементы в контейнере и сохраняем ссылки на них
        this._close = ensureElement<HTMLElement>('.order-success__close', this.container);
        this._total = ensureElement<HTMLElement>('.order-success__description', this.container);

        // Добавляем обработчик клика на кнопку закрытия, если он передан в actions
        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }

    // Сеттер для установки общего количества списанных "синапсов"
    set total(value: string) {
      this._total.textContent = `Списано ${value} синапсов`; // Устанавливаем текстовое содержимое
    }
}
