// Импортируем базовый класс Form
import { Form } from "./common/Form";

// Импортируем интерфейсы, используемые в формах
import { IDeliveryForm, IContactForm, IActions } from "../types";
import { IEvents } from "../types";

// Импортируем утилиту для поиска элементов
import { ensureElement } from "../utils/utils";

// Функция валидации email
function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Функция валидации номера телефона (простой формат)
function isValidPhone(phone: string): boolean {
    return /^\+?\d{10,15}$/.test(phone);
}

// Класс формы доставки, наследуется от Form с типизацией IDeliveryForm
export class DeliveryForm extends Form<IDeliveryForm> {
    // Кнопки выбора способа оплаты
    protected _cardButton: HTMLButtonElement;
    protected _cashButton: HTMLButtonElement;

    // Конструктор принимает контейнер формы, события и необязательные действия
    constructor(container: HTMLFormElement, events: IEvents, actions?: IActions) {
        super(container, events); // Вызываем конструктор родительского класса

        // Получаем кнопки выбора оплаты
        this._cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this._cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);

        // Устанавливаем начальное активное состояние для кнопки "Картой"
        this._cardButton.classList.add('button_alt-active');

        // Если переданы действия, добавляем обработчики кликов
        if (actions?.onClick) {
            this._cardButton.addEventListener('click', actions.onClick);
            this._cashButton.addEventListener('click', actions.onClick);
        }
    }

    // Метод переключения активной кнопки оплаты
    toggleButtons(target: HTMLElement) {
        this._cardButton.classList.toggle('button_alt-active');
        this._cashButton.classList.toggle('button_alt-active');
    }

    // Сеттер для адреса доставки
    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}

// Класс формы контактов, наследуется от Form с типизацией IContactForm
export class ContactForm extends Form<IContactForm> {
    // Конструктор принимает контейнер формы и объект событий
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this.addValidation();
    }

    // Добавление валидации на ввод email и телефона
    private addValidation() {
        const phoneInput = this.container.elements.namedItem('phone') as HTMLInputElement;
        const emailInput = this.container.elements.namedItem('email') as HTMLInputElement;
        
        phoneInput.addEventListener('input', () => {
            if (!isValidPhone(phoneInput.value)) {
                phoneInput.setCustomValidity('Введите корректный номер телефона');
            } else {
                phoneInput.setCustomValidity('');
            }
        });

        emailInput.addEventListener('input', () => {
            if (!isValidEmail(emailInput.value)) {
                emailInput.setCustomValidity('Введите корректный email');
            } else {
                emailInput.setCustomValidity('');
            }
        });
    }

    // Сеттер для телефона
    set phone(value: string) {
        const phoneInput = this.container.elements.namedItem('phone') as HTMLInputElement;
        phoneInput.value = value;
        phoneInput.dispatchEvent(new Event('input'));
    }

    // Сеттер для email
    set email(value: string) {
        const emailInput = this.container.elements.namedItem('email') as HTMLInputElement;
        emailInput.value = value;
        emailInput.dispatchEvent(new Event('input'));
    }
}
