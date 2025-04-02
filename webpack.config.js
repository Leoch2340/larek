// Generated using webpack-cli https://github.com/webpack/webpack-cli

// Подключаем встроенный модуль Node.js для работы с путями
const path = require("path");

// Подключаем плагины для работы с HTML, CSS и переменными окружения
const HtmlWebpackPlugin = require("html-webpack-plugin"); // Генерация HTML-файла
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // Извлечение CSS в отдельный файл
const { DefinePlugin } = require('webpack'); // Определение глобальных переменных окружения
const TerserPlugin = require("terser-webpack-plugin"); // Оптимизация JavaScript-кода

// Загружаем переменные окружения из .env-файла
require('dotenv').config({
  path: path.join(process.cwd(), process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env')
});

// Определяем, является ли текущий режим сборки продакшеном
const isProduction = process.env.NODE_ENV == "production";

// Определяем обработчик стилей (MiniCssExtractPlugin в продакшене)
const stylesHandler = MiniCssExtractPlugin.loader;

// Конфигурация Webpack
const config = {
  entry: "./src/index.ts", // Входная точка приложения
  devtool: "source-map", // Генерация карт исходного кода для отладки
  output: {
    path: path.resolve(__dirname, "dist"), // Папка для собранных файлов
  },
  devServer: {
    open: true, // Автоматически открывать браузер
    host: "localhost", // Сервер разработки будет работать на localhost
    watchFiles: ["src/pages/*.html"], // Следить за изменениями в HTML-файлах
    hot: true // Включить поддержку горячей перезагрузки
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/pages/index.html" // Шаблон HTML-файла
    }),
    new MiniCssExtractPlugin(), // Плагин для извлечения CSS в отдельный файл
    new DefinePlugin({ // Определяем глобальные переменные окружения
      'process.env.DEVELOPMENT': !isProduction, // Флаг разработки
      'process.env.API_ORIGIN': JSON.stringify(process.env.API_ORIGIN ?? '') // Базовый URL API
    })
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i, // Обрабатываем TypeScript-файлы
        use: ["babel-loader", "ts-loader"], // Компиляция TypeScript через Babel и ts-loader
        exclude: ["/node_modules/"], // Исключаем папку node_modules
      },
      {
        test: /\.s[ac]ss$/i, // Обрабатываем SCSS/SASS файлы
        use: [stylesHandler, "css-loader", "postcss-loader", "resolve-url-loader", {
          loader: "sass-loader",
          options: {
            sourceMap: true, // Включаем sourcemaps для SASS
            sassOptions: {
              includePaths: ["src/scss"] // Указываем путь к SCSS-файлам
            }
          }
        }],
      },
      {
        test: /\.css$/i, // Обрабатываем обычные CSS-файлы
        use: [stylesHandler, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i, // Обрабатываем файлы шрифтов и изображений
        type: "asset", // Используем Webpack Asset Modules
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", "..."], // Разрешаемые расширения файлов
  },
  optimization: {
    minimize: true, // Включаем минимизацию кода
    minimizer: [new TerserPlugin({ // Настройки TerserPlugin
      terserOptions: {
        keep_classnames: true, // Сохраняем имена классов
        keep_fnames: true // Сохраняем имена функций
      }
    })]
  }
};

// Экспортируем конфигурацию с учётом режима (production или development)
module.exports = () => {
  if (isProduction) {
    config.mode = "production"; // Устанавливаем режим продакшена
  } else {
    config.mode = "development"; // Устанавливаем режим разработки
  }
  return config;
};
