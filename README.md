# Web Ларёк
Фронтенд веб-приложения для онлайн-магазина, использующее HTML, SCSS, TypeScript и Webpack.

## Что сделано
- Описана архитектура приложения 
- сверстаны основные HTML-страницы и стили на SCSS;
- написаны компоненты на TypeScript с использованием принципов ООП;
- настроена сборка проекта с помощью Webpack.

## Реализованный функционал
- главная страница с каталогом товаров;
- страница продукта с детальной информацией;
- корзина для покупок;
- форма заказа и контактов.

## Технологии
- TypeScript, HTML, SCSS, Webpack;
- принцип ООП для структуры компонентов;
- ESLint и Prettier для поддержания качества кода.

# Инструкция по запуску
Чтобы запустить проект, нужно сделать несколько простых шагов:

Склонируйте этот репозиторий:

```shell
git clone https://github.com/Leoch2340/larek.git
```

Установите все зависимости:

```shell
npm install
```

Теперь можете запустить проект:

```shell
npm run start
```

Для сборки проекта выполните команду:

```shell
npm run build
```

## Системные требования
Для запуска потребуется Node.js 

## О архитектре
Взаимодействия внутри приложения происходят через события. Модели инициализируют события, слушатели событий в основном коде выполняют передачу данных компонентам отображения, а так-же вычислениями между этой передачей, так же они меняют значения в моделях.
## Базовый код (base)
### 1. Класс `Component<T>`
Абстрактный базовый класс, предназначенным для создания компонентов пользовательского интерфейса. Класс обеспечивает инструментарий для управления DOM элементами и поведением компонента. Наследуется всеми классами представления(View)

`constructor(container: HTMLElement)` - принимает элемент контейнера, в который будет помещен компонент.

Методы:
  - `toggleClass` - переключается класс для переданного элемента.
  - `setText` - устанавливает текстовое содержимое для переданного элемента.
  - `setImage` - устанавливает изображения и альтернативный текст для изоображения(опционально) для переданного элемента типа HTMLImageElement
  - `setDisabled` - изменяет статус блокировки для переданного элемента.
  - `setHidden`, `setVisible` - скрывает,отоброжает переданный элемент.
  - `render` - рендерит компонент, используя переданные данные. Метод должен быть переназначен в дочерних классах.
### 2. Класс `Model<T>`
Абстрактный базовый класс, предназначенный для создания модельных данных. Модели используются для представления и управления данными в приложении.

`constructor(data:Partial<T>, events: IEvenets)` - принимает начальный данные для модели и объект событий для уведомления о изменениях в модели.

Методы:
  - `emitChanges` - инициирует событие с переданным названием и данными, уведомляя подписчиков в изменении модели
### 3. Класс `Api`
Базовый класс для работы с API, реализует методы для выполнения HTTP-запросов к переданному базовуму URL.

`constructor(baseUrl: string, options: RequestInit = {})`- принимает базовый URL и глобальные опции для всех запросов(опционально).

Методы:
  - `handleResponse` - отрабатывает ответы от сервера, преобразуя их в json и управляя ошибками.
  - `get` - выполняет GET запросы к предоставленному URL.
  - `post` - выполняет запрос к API с использованием предоставленного метода(POST|PUT|DELETE) и предоставленными данными.
### 4. Класс `EventEmmiter`
Базовый класс реализующий функции брокера событий.

`constructor()` - инициализирует объект.

Методы:
  - `on`, `off`, `emmit` - подписывают, снимают подписку и инициируют событие соответственно.
  - `onAll`, `ofAll` - подписывает на все события и сбрасывает все обработчики событий соответсвенно.
  - `trigger` - генерирует заданной событие с заданными аргументами. Позволяет передавать его в качестве обработчика события в другие классы, не зависящии напрямую от класса `EventEmmiter`.

## Компоненты модели данных(бизнес-логика)
### 1. Класс `Product`
Класс предназначен для создания и упрвления данными продукта. Обеспечивает представление информации о продукте, которое может быть использовано для отображения или для обработки в бизнес-логике. Наследуется от `Model<IProduct>`.

`constructor()` наследуется от `Model`

Методы:
  - наследует методы из `Model`.
### 2. Класс `AppData`
Класс предстваляющий состояние приложения, включая данные каталога, предпросмотра, корзины, заказа и ошибок формы. Наследуется от `Model<IAppState>`.

`constructor()` наследуется от `Model`

Методы:
 -  наследует методы из `Model`
  - `clearBasket` - очищает данные корзины.
  - `clearOrder` - очищает данные заказа.
  - `setCatalog` - устанавливает каталог продуктов, преобразуя каждый элемент в экземпляр Product и инициализирует событие изменения каталога.
  - `setPreview` - устанавливает предпросомотр продукта и инициализирует событие об изменении предпросмотра.
  - `addToBasket` - добавляет товар в корзину.
  - `removeFromBasket` - удаляет товар из корзины.
  - `updateBasket` - инициализирует событие обновление корзины и изменения счетчика.
  - `setDeliveryField`/`setContactField` - устанавливает значени в данные доставки/контактов заказа, при успешной валидации инициализирует события готовности данных доставки/контактов.
  - `ValidateDelivery`/`ValidateContact` - проверяет валидность формы доставки/контактов.

## Общие компоненты представления (common)
### 1. Класс `Modal`
Класс для создания и управления модальными окнами. Позволяет открывать и закрывать модальное окно, а так же управлять его содержимым. Наследуется от `Component<IModalData>`.

`constructor(container: HTMLElement, events: IEvents)` - принимает элеменет-контейнер для модального окна и объект для управления событиями.

Методы:
  - `content` - устанавливает содержимое модального окна.
  - `open` - открывает модальное окно и инициирует событие открытия модалки.
  - `close` - закрывает модальное окно и инициирует событие зыкрытие модалки.
  - `render` - Рендерит модальное окно с переданным содержимым и открывает его.
### 2. Класс `Form`
Класс для создания и управления формами. Он обеспечивает обработку событий ввода и отправки, так же управляет состоянием валидности и отображения формы. Наследуется от `Component<IFormState>`.

`constructor(container: HTMLFormElement, events: IEvents)` - принимает контейнер формы и объект для управлением событиями.

Методы:
  `InInputChange` - обработчик событий ввода, который эмиттирует события изменения для каждого поля формы.
  set `valid` - управляет доступностью кнопки оптравки в зависимости от валидности формы.
  set `errors` - устанавливает и отображает ошибки валидации формы.
  `render` - рендерит состояние формы, устанвливая валидность, ошибки и значения полей.

## Компоненты представления
### 1. Класс `Page`
Класс, предназначенный для управления и отоброжения основных элементов страницы, таких как каталог продуктов, счетчик товаров в корзине, а так же позволяющий блокировать прокрутку страницы. Наследуется от `Component<IPage>`

`constructor(container: HTMLElement, events: IEvents)` -  принимает контейнер страницы и объект для управлением событий.

Методы:
  - set `counter` - устанавливает значение счетчика.
  - set `catalog` - заменяет содержимое каталога предоставленными данными.
  - set `locked` - переключает блокировку интерфейса в зависимости от переденного значения.
### 2. Класс `Card`
Класс предназначенный для отображения и управления карточками товара(в каталоге, на превью и в корзине), а так-же обработку событий пользователя. Реализует интерфейс `IProduct`. Наследуется от `Component<ICard>`

`constructor(container: HTMLElement, actions?: IActions)` - принимает контейнер карточки и действия связанный с карточкой(опционально).

Методы:
  - `disablePriceButton` - проверяет цену и делает кнопку покупки неактивной если цена не указана.
  - set/get `id` - управляет индификатором карточки.
  - set/get `title` - управляет названием товара.
  - set/get `price` - управляет ценой товара.
  - set/get `category` - управляет категорией и ее цветом.
  - set `image` - устанавливает изображение товара.
  - set `description` - устанавливает описание товара.
  - set `buttonTitle` - устанавливает textContent кнопки.
### 3. Класс `Basket`
Класс для отображения и управления компонентом корзины покупок. Обеспечивает отображение товаров, управление их выбором и общей стоимостью.

`constructor(container: HTMLElement, events: EventEmitter)` - принимает контейнер страницы и объект для управлением событий. Наследуется от `Component<IBasketView>`.

Методы:
  - `toggleButton` - переключает доступность кнопки.
  - set `items` - устанавливает товары в корзине.
  - set `total` - устанавливает общую стоимость товаров.
### 4. Класс `DeliveryForm`
Класс для отображения и управления формой доставки, включая метод оплаты и ввод адреса доставки. Наследуется от `Form<IDeliveryForm>`.

`constructor(container: HTMLFormElement, events: IEvents, actions?: IActions)` - принимает контейнер формы доставки, объект для управления событиями и действия для обработки кликов в форме(опционально).

Методы:
  - `toggleButtons` - переключает активность кнопок оплаты.
  - set `address` - устанавливает адрес доставки.
### 5. Класс `ContactForm`
Класс для отображения и управления формой контактных данных, включая ввод телефона и электронной почты. Наследуется от `Form<IContactForm>`.

`constructor(container: HTMLFormElement, events: IEvents)` - принимает контейнер формы доставки и объект для управления событиями.

Методы:
 - set `phone` - устанавливает номер телефона.
 - set `email` - устанавливает адрес электронной почты.
### 6. Класс `Success`
Класс для отоброжения и управления компонентом, отображающим сообщение об успешной операции, например, после оформления заказа. Наследуется от `Component<ISuccess>`.

`constructor(container: HTMLElement, actions: ISuccessActions)` - принимает контейнер и и объект для управления событиями.

Методы:
  - set `total` - устанавливает текст отображающий сумму операции.

## Ключевые типы данных
```
Типы данных для базовых классов:

// Общие методы события
export interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void; // обработчик события
    emit<T extends object>(event: string, data?: T): void; // инициатор события
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void; // колбек триггер события
}

// Данные ответа от сервера
export type ApiListResponse<Type> = {
    total: number, // общая стоимость товаров
    items: Type[] // список заказанных товаров
};

// Методы запросов к серверу
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

Типы данных для общих компонентов:

// Данные обработчика валидности формы
export interface IFormState {
    valid: boolean; // валидность всей формы
    errors: string[]; // ошибки валидации формы
}

// Данные контента для отрисовки внутри Модалки
export interface IModalData {
    content: HTMLElement; // контейнер отрисовываемый в Модалке
}

Все остальные типы данных:

// Товар
export interface IProduct {
  id: string; // id товара
  title: string; // имя товара
  price: number | null; // цена товара
  description: string; // описание товара
  category: string; // категория товара
  image: string; // изображение товара
}

// Состояние приложения
export interface IAppState {
  catalog: IProduct[]; // все товары в каталоге
  basket: IProduct[]; // все id товаров в корзине
  preview: string | null; // id товара в окне детального просмотра
  order: IOrder | null; // данные о заказе
}

// Данные доставки
export interface IDeliveryForm {
  payment: string; // способ оплаты
  address: string; // адрес доставки
}

// контактные данные
export interface IContactForm {
  email: string; // электронная почта
  phone: string; //
}

// Данные всего заказа
export interface IOrder extends IDeliveryForm, IContactForm {
  total: number; // общая сумма заказа
  items: string[]; // id всех товаров в заказе
}

// Данные ответа сервера на заказ
export interface IOrderResult {
  id: string; // id заказа
  total: number; // общая сумма заказа
}

// Ошибки Форм
export type FormErrors = Partial<Record<keyof IOrder, string>>;

// Данные для отображения карточки
export interface ICard extends IProduct{
  index?: string; // индекс товара в корзине(опционально)
  buttonTitle? : string; // textContent для кнопки покупки
}

// Данные для отображения корзиный
export interface IBasketView {
  items: HTMLElement[]; // список карточек в корзине
  total: number; // итоговая стоимость товаров в корзине
}

// Данный для отображения главной страницы
export interface IPage{
  counter: number; // значение счетчика корзины
  catalog: HTMLElement[]; // список карточек в каталоге
}

//Данные для отображения успешного заказа
export interface ISuccess {
  total: number; // итоговая стоимость товара
}

// Действия передаваемые в конструктор
export interface IActions {
  onClick: (event: MouseEvent) => void; // действие нажатия мышки
}

// Действия передаваемые в конструктор успешного заказа
export interface ISuccessActions {
  onClick: () => void; // любое действие
}


// Список всех событий
items:changed // изменение продуктов в каталоге
card:select // выбор карточки из каталона
preview:changed // изменение окна детального просмотра
product:toggle // переключение продукта в коризне
product:add // добавление продукта в корзину
product:delete // удаление продукта из корзины
basket:changed // изменение корзины
counter:changed // изменение счетчика корзины
basket:open // открытие окна корзины
order:open // открытие окна формы доставки
payment:toggle // изменение способа оплаты
formErrors:change // изменение списка ошибок
/^order\..*:change/ // изменение любого поля формы доставки
/^contacts\..*:change/ // изменение любого поля формы контактов
delivery:ready // события готовности формы доставки к отправке
contact:ready // события готовности формы контактов к отправке
order:submit // отправка формы доставки
contacts:submit // отправка формы контактов
modal:open // открытие модального окна
modal:close // закрытие модального окна
```

## Шаблоны в верстке
В верстке используются все шаблоны предоставленный в исходном `index.html`. В класс `Card` передается шаблон с id `card-catalog`/`card-preview`/`card-basket` в зависимости от того где она отрисовывается.
