## Как запустить?

Скачать [Node.js](https://nodejs.org/en).

Открыть проект в VS Code.

Добавить файл `.env.local`, добавить туда все требуемые переменные, которые перечислены ниже.

- UPSTASH_REDIS_REST_URL
- UPSTASH_REDIS_REST_TOKEN
- NEXTAUTH_URL
- NEXTAUTH_SECRET
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- PUSHER_APP_ID
- NEXT_PUBLIC_PUSHER_APP_KEY
- PUSHER_APP_SECRET

Установить pnpm

```sh
npm install -g pnpm
```

В папке проекта: установить зависимости и запустить.

```sh
pnpm install

pnpm dev
```
