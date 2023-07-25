const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4002;

const amqp = require('amqplib');
var channel, connection;

connectQueue();

async function connectQueue() {
  try {
    connection = await amqp.connect('amqp://localhost:5672');
    channel = await connection.createChannel();

    await channel.assertQueue('first');

    channel.consume('first', async (data) => {
      console.log('Получено с M1 : ', `${Buffer.from(data.content)}`);
      channel.ack(data);
      const newObj = JSON.parse(data.content.toString());
      newObj.received = true;

      channel.sendToQueue('second', Buffer.from(JSON.stringify(newObj)));
      console.log('Сообщение отправлено с M2');
    });
  } catch (error) {
    console.log(error);
  }
}

app.listen(PORT, () => console.log('Server running at port ' + PORT));
