const express = require('express');
const app = express();
const PORT = process.env.PORT || 4001;

app.use(express.json());

const amqp = require('amqplib');
var channel, connection;

connectQueue();
async function connectQueue() {
  try {
    connection = await amqp.connect('amqp://localhost:5672');
    channel = await connection.createChannel();

    await channel.assertQueue('second');
  } catch (error) {
    console.log(error);
  }
}

app.get('/send', async (req, res) => {
  const data = {
    contact: 'John Cena',
    message: 'Hello World!',
  };

  let buf = Buffer.from(JSON.stringify(data));

  channel.sendToQueue('first', buf);
  console.log('Сообщение отправлено с М1');

  await channel.consume('second', (data) => {
    console.log('Получено с M2 : ', `${Buffer.from(data.content)}`);
    channel.ack(data);
  });
  res.send('Запрос отправлен');
});

app.listen(PORT, () => console.log('Server running at port ' + PORT));
