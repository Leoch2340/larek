/* 
Ваш код представляет собой комплексную структуру приложения с обработкой событий, 
API-запросами и динамическим обновлением данных на странице. 
*/

// Импорт стилей
import './scss/styles.scss';

// Импорт классов и утилит
import {LarekAPI} from "./components/LarekAPI"; // API-клиент
import {API_URL, CDN_URL, PaymentMethods} from "./utils/constants"; // Константы приложения
import {EventEmitter} from "./components/base/events"; // Событийный механизм
import {AppState, CatalogChangeEvent, Product} from "./components/AppData"; // Управление состоянием
import {Page} from "./components/Page"; // Класс для работы со страницей
import {cloneTemplate, createElement, ensureElement} from "./utils/utils"; // Утилиты
import {Modal} from "./components/common/Modal"; // Модальное окно
import {IContactForm, IDeliveryForm, IOrder} from "./types"; // Типы данных
import { Card } from './components/Card'; // Карточка товара
import { Basket } from './components/Basket'; // Корзина
import { DeliveryForm, ContactForm } from './components/Order'; // Формы доставки и контактов
import { Success } from './components/Success'; // Успешное оформление заказа

// Создаем экземпляры классов
const events = new EventEmitter(); // Управление событиями
const api = new LarekAPI(CDN_URL, API_URL); // API-клиент

// Получаем шаблоны из DOM
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog'); // Карточка каталога
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview'); // Карточка предпросмотра
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket'); // Карточка в корзине
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket'); // Шаблон корзины
const deliveryTemplate = ensureElement<HTMLTemplateElement>('#order'); // Шаблон доставки
const contactTemplate = ensureElement<HTMLTemplateElement>('#contacts'); // Шаблон формы контактов
const successTemplate = ensureElement<HTMLTemplateElement>('#success'); // Шаблон успешного заказа

// Создание глобального состояния приложения
const appData = new AppState({}, events); // Состояние приложения

// Создание глобальных элементов страницы
const page = new Page(document.body, events); // Главный контейнер страницы
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events); // Модальное окно
const basket = new Basket(cloneTemplate(basketTemplate), events); // Корзина
const delivery = new DeliveryForm(cloneTemplate(deliveryTemplate), events, { // Форма доставки
  onClick: (ev: Event) => events.emit('payment:toggle', ev.target) // Обработчик смены метода оплаты
});
const contact = new ContactForm(cloneTemplate(contactTemplate), events); // Форма контактов

// Обновление каталога при изменении списка товаров
events.on<CatalogChangeEvent>('items:changed', () => {
  page.catalog = appData.catalog.map(item => {
    const card = new Card(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit('card:select', item) // Открытие карточки товара
    });
    return card.render({
      title: item.title,
      image: item.image,
      price: item.price,
      category: item.category
    })
  })
});

// Открытие товара в модальном окне
events.on('card:select', (item: Product) => {
  appData.setPreview(item);
});

events.on('preview:changed', (item: Product) => {
  const card = new Card(cloneTemplate(cardPreviewTemplate), {
    onClick: () => {
      events.emit('product:toggle', item);
      card.buttonTitle = (appData.basket.indexOf(item) < 0) ? 'Купить' : 'Удалить из корзины'
    }
  });
  modal.render({
    content: card.render({
      title: item.title,
      description: item.description,
      image: item.image,
      price: item.price,
      category: item.category,
      buttonTitle: (appData.basket.indexOf(item) < 0) ? 'Купить' : "Удалить из корзины"
    })
  })
})

// Переключение товара (добавление/удаление из корзины)
events.on('product:toggle', (item: Product) => {
  if(appData.basket.indexOf(item) < 0){
    events.emit('product:add', item);
  }
  else{
    events.emit('product:delete', item);
  }
})

// Добавление товара в корзину
events.on('product:add', (item: Product) => {
  appData.addToBasket(item);
});

// Удаление товара из корзины
events.on('product:delete', (item: Product) => appData.removeFromBasket(item));

// Обновление корзины
events.on('basket:changed', (items: Product[]) => {
  basket.items = items.map((item, index) => {
    const card = new Card(cloneTemplate(cardBasketTemplate), {
      onClick: () => {
        events.emit('product:delete', item)
      }
    });
    return card.render({
      index: (index+1).toString(),
      title: item.title,
      price: item.price,
    })
  })
  const total = items.reduce((total, item) => total + item.price, 0)
  basket.total = total
  appData.order.total = total;
  basket.toggleButton(total === 0)
})

// Обновление счетчика товаров в корзине
events.on('counter:changed', (item: string[]) => {
  page.counter = appData.basket.length;
})

// Открытие корзины
events.on('basket:open', () => {
  modal.render({
    content: basket.render({})
  })
});

// Открытие формы доставки
events.on('order:open', () => {
  modal.render({
    content: delivery.render({
      payment: '',
      address: '',
      valid: false,
      errors:[]
    })
  })
  appData.order.items = appData.basket.map((item) => item.id);
})

// Смена метода оплаты
events.on('payment:toggle', (target: HTMLElement) => {
  if(!target.classList.contains('button_alt-active')){
    delivery.toggleButtons(target);
    appData.order.payment = PaymentMethods[target.getAttribute('name')];
    console.log(appData.order)
  }
})

// Валидация форм
events.on('formErrors:change', (errors: Partial<IOrder>) => {
  const {payment, address ,email, phone} = errors;
  delivery.valid = !payment && !address;
  contact.valid = !email && !phone;
  delivery.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
  contact.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

// Обновление полей доставки
events.on(/^order\..*:change/, (data: {field: keyof IDeliveryForm, value: string}) => {
  appData.setDeliveryField(data.field, data.value)
})

// Обновление полей контактов
events.on(/^contacts\..*:change/, (data: {field: keyof IContactForm, value: string}) => {
  appData.setContactField(data.field, data.value)
})

// Проверка заполненности формы доставки
events.on('delivery:ready' , () => {
  delivery.valid = true;
})

// Проверка заполненности формы контактов
events.on('contact:ready', () => {
  contact.valid = true;
})

// Переход к форме контактов
events.on('order:submit', () => {
  modal.render({
    content: contact.render({
      email: '',
      phone: '',
      valid: false,
      errors: []
    })
  })
})

// Оформление заказа
events.on('contacts:submit', () => {
  api.orderProducts(appData.order)
    .then((result) => {
      appData.clearBasket();
      appData.clearOrder();
      const success = new Success(cloneTemplate(successTemplate), {
          onClick: () => {
              modal.close();
          }
      });
      success.total = result.total.toString();

      modal.render({
          content: success.render({})
      });
    })
    .catch(err => {
        console.error(err);
    });
})

// Блокировка страницы при открытии модального окна
events.on('modal:open', () => {
  page.locked = true;
});

// Разблокировка страницы при закрытии модального окна
events.on('modal:close', () => {
  page.locked = false;
});

// Загрузка каталога товаров при старте приложения
api.getProductList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
      console.log(err);
    });
