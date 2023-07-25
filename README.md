## Тестовое задание Разработчик Node.js

- Запустить rabbitmq (через docker). Port 5672

```
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.12-management

```

- Запустить сервис M1

```
cd M1
```

```
npm i
```

```
node index.js
```

- Запустить сервис M2

```
cd M2
```

```
npm i
```

```
node index.js
```

- Отправить GET запрос на http://localhost:4001/send
