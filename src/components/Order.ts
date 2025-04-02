import { Form } from "./common/Form";
import { IContactForm } from "../types";
import { IEvents } from "../types";
import { ensureElement } from "../utils/utils";

// Класс формы контактов, наследуется от Form с типизацией IContactForm
export class ContactForm extends Form<IContactForm> {
    // Конструктор принимает контейнер формы и объект событий
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events); // Вызываем конструктор родительского класса

        const phoneInput = this.getPhoneInput();
        if (phoneInput) {
            phoneInput.addEventListener('input', () => this.validatePhone());
            phoneInput.addEventListener('invalid', (event) => {
                event.preventDefault(); // Отключаем стандартное всплывающее окно
            });
        }

        const emailInput = this.getEmailInput();
        if (emailInput) {
            emailInput.addEventListener('input', () => this.validateEmail());
            emailInput.addEventListener('invalid', (event) => {
                event.preventDefault(); // Отключаем стандартное всплывающее окно
            });
        }
    }

    // Сеттер для телефона
    set phone(value: string) {
        const phoneInput = this.getPhoneInput();
        if (phoneInput) {
            phoneInput.value = value;
            this.validatePhone();
        }
    }

    // Сеттер для email
    set email(value: string) {
        const emailInput = this.getEmailInput();
        if (emailInput) {
            emailInput.value = value;
            this.validateEmail();
        }
    }

    // Валидация телефона
    private validatePhone() {
        const phoneInput = this.getPhoneInput();
        if (!phoneInput) return;

        const phoneValue = phoneInput.value.trim();
        const phonePattern = /^\+?\d{10,15}$/; // Допускает + и от 10 до 15 цифр

        if (!phonePattern.test(phoneValue)) {
            phoneInput.setCustomValidity('Введите корректный номер телефона');
        } else {
            phoneInput.setCustomValidity('');
        }
    }

    // Валидация email
    private validateEmail() {
        const emailInput = this.getEmailInput();
        if (!emailInput) return;

        const emailValue = emailInput.value.trim();
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/; // Стандартная проверка email

        if (!emailPattern.test(emailValue)) {
            emailInput.setCustomValidity('Введите корректный адрес электронной почты');
        } else {
            emailInput.setCustomValidity('');
        }
    }

    // Получаем поле телефона
    private getPhoneInput(): HTMLInputElement | null {
        return this.container.elements.namedItem('phone') as HTMLInputElement | null;
    }

    // Получаем поле email
    private getEmailInput(): HTMLInputElement | null {
        return this.container.elements.namedItem('email') as HTMLInputElement | null;
    }
}
