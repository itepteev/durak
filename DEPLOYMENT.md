# Инструкции по развертыванию игры "Дурак"

## Варианты развертывания

### 1. GitHub Pages (Рекомендуется)

#### Шаги:
1. **Создайте репозиторий на GitHub**:
   - Перейдите на [github.com](https://github.com)
   - Нажмите "New repository"
   - Назовите репозиторий `durak-game`
   - Оставьте его публичным
   - Не инициализируйте с README

2. **Загрузите код в репозиторий**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/durak-game.git
   git branch -M main
   git push -u origin main
   ```

3. **Включите GitHub Pages**:
   - Перейдите в Settings репозитория
   - Прокрутите до раздела "Pages"
   - В "Source" выберите "Deploy from a branch"
   - Выберите ветку "main"
   - Нажмите "Save"

4. **Доступ к игре**:
   - Игра будет доступна по адресу: `https://YOUR_USERNAME.github.io/durak-game`

### 2. Netlify

#### Шаги:
1. **Зарегистрируйтесь на Netlify**:
   - Перейдите на [netlify.com](https://netlify.com)
   - Создайте аккаунт

2. **Загрузите файлы**:
   - Перетащите папку с проектом в область загрузки на Netlify
   - Или подключите GitHub репозиторий

3. **Настройте домен**:
   - Netlify автоматически создаст URL вида: `https://random-name.netlify.app`
   - Вы можете настроить кастомный домен в настройках

### 3. Vercel

#### Шаги:
1. **Зарегистрируйтесь на Vercel**:
   - Перейдите на [vercel.com](https://vercel.com)
   - Создайте аккаунт

2. **Подключите репозиторий**:
   - Нажмите "New Project"
   - Подключите ваш GitHub репозиторий
   - Vercel автоматически определит настройки

3. **Деплой**:
   - Нажмите "Deploy"
   - Получите URL вида: `https://your-project.vercel.app`

### 4. Обычный веб-сервер

#### Для Apache:
1. Загрузите файлы в `/var/www/html/` или папку вашего сайта
2. Убедитесь, что Apache настроен для статических файлов
3. Откройте `http://your-domain.com/index.html`

#### Для Nginx:
1. Загрузите файлы в `/usr/share/nginx/html/` или папку вашего сайта
2. Настройте Nginx для обслуживания статических файлов
3. Откройте `http://your-domain.com/index.html`

## Проверка работоспособности

После развертывания проверьте:

1. **Открытие игры**: Игра должна загружаться без ошибок
2. **Начало игры**: Кнопка "Начать игру" должна работать
3. **Раздача карт**: Карты должны раздаваться корректно
4. **Игровой процесс**: Все действия должны выполняться правильно
5. **Адаптивность**: Игра должна работать на мобильных устройствах

## Оптимизация для продакшена

### Для GitHub Pages:
- Файлы уже оптимизированы
- Дополнительная оптимизация не требуется

### Для других платформ:
1. **Сжатие файлов**:
   ```bash
   # Установите gzip для сжатия
   gzip -9 index.html
   gzip -9 styles.css
   gzip -9 game.js
   ```

2. **Кэширование**:
   Добавьте заголовки кэширования в конфигурацию сервера:
   ```
   Cache-Control: public, max-age=31536000
   ```

3. **HTTPS**:
   Убедитесь, что сайт работает по HTTPS

## Мониторинг

### Google Analytics:
Добавьте в `<head>` файла `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Обработка ошибок:
Добавьте в `game.js`:
```javascript
window.addEventListener('error', function(e) {
  console.error('Game error:', e.error);
  // Отправка ошибки в систему мониторинга
});
```

## Обновления

### Для GitHub Pages:
1. Внесите изменения в код
2. Зафиксируйте изменения:
   ```bash
   git add .
   git commit -m "Update game"
   git push
   ```
3. GitHub Pages автоматически обновится

### Для других платформ:
- Netlify и Vercel автоматически обновляются при пуше в репозиторий
- Для обычных серверов загрузите обновленные файлы вручную

## Безопасность

1. **HTTPS**: Всегда используйте HTTPS в продакшене
2. **Заголовки безопасности**: Добавьте в конфигурацию сервера:
   ```
   X-Content-Type-Options: nosniff
   X-Frame-Options: DENY
   X-XSS-Protection: 1; mode=block
   ```

## Поддержка

При возникновении проблем:
1. Проверьте консоль браузера на ошибки
2. Убедитесь, что все файлы загружены корректно
3. Проверьте настройки сервера
4. Обратитесь к документации платформы развертывания 