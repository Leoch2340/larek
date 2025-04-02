// Импортируем базовый класс Form
import { Form } from "./common/Form";

// Импортируем интерфейсы, используемые в формах
import { IDeliveryForm, IContactForm, IActions } from "../types";
import { IEvents } from "../types";

// Импортируем утилиту для поиска элементов
import { ensureElement } from "../utils/utils";

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

// Класс ContactForm с валидацией для телефона и email
export class ContactForm extends Form<IContactForm> {
  // Конструктор принимает контейнер формы и объект событий
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events); // Вызываем конструктор родительского класса
  }

  // Сеттер для телефона
  set phone(value: string) {
    const phoneInput = this.container.elements.namedItem('phone') as HTMLInputElement;
    phoneInput.value = value;
  }

  // Сеттер для email
  set email(value: string) {
    const emailInput = this.container.elements.namedItem('email') as HTMLInputElement;
    emailInput.value = value;
  }

  // Метод для валидации телефона
  validatePhone(phone: string): boolean {
    // Пример валидации для номера телефона, поддерживающий формат +1 (234) 567-8901
    const phonePattern = /^[\+\d]?(?:[\d\-()\s]+)$/;
    return phonePattern.test(phone);
  }

  // Метод для валидации email
  validateEmail(email: string): boolean {
    // Простое регулярное выражение для проверки email
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  // Метод для выполнения валидации перед отправкой формы
  validateForm(): boolean {
    const email = (this.container.elements.namedItem('email') as HTMLInputElement).value;
    const phone = (this.container.elements.namedItem('phone') as HTMLInputElement).value;

    const isEmailValid = this.validateEmail(email);
    const isPhoneValid = this.validatePhone(phone);

    if (!isEmailValid) {
      alert('Введите корректный email.');
    }

    if (!isPhoneValid) {
      alert('Введите корректный номер телефона.');
    }

    return isEmailValid && isPhoneValid;
  }
}
