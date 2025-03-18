// Импортируем базовый класс API
import { Api } from "./base/api";

// Импортируем интерфейсы, которые используются в API
import { IOrderResult, IProduct, IOrder, ApiListResponse, ILarekAPI } from "../types";

// Создаём класс LarekAPI, который наследуется от базового API и реализует интерфейс ILarekAPI
export class LarekAPI extends Api implements ILarekAPI {
  // Поле для хранения адреса CDN
  readonly cdn: string;

  // Конструктор принимает URL для CDN, базовый URL API и дополнительные опции
  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options); // Вызываем конструктор родительского класса
    this.cdn = cdn; // Сохраняем адрес CDN
  }

  // Метод получения списка товаров
  getProductList(): Promise<IProduct[]> {
    return this.get('/product') // Делаем GET-запрос к API
      .then((data: ApiListResponse<IProduct>) => // Обрабатываем ответ
        data.items.map((item) => ({ 
          ...item, 
          image: this.cdn + item.image // Добавляем полный путь к изображению товара
        }))
      );
  }

  // Метод получения конкретного товара по его ID
  getProductItem(id: string): Promise<IProduct> {
    return this.get(`/product/${id}`) // Делаем GET-запрос к API с ID товара
      .then((item: IProduct) => ({ 
        ...item, 
        image: this.cdn + item.image // Добавляем полный путь к изображению товара
      }));
  }

  // Метод для оформления заказа
  orderProducts(order: IOrder): Promise<IOrderResult> {
    return this.post(`/order`, order) // Делаем POST-запрос на оформление заказа
      .then((data: IOrderResult) => data); // Возвращаем полученные данные
  }
}
