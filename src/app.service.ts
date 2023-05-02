import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class AppService {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor() {
    this.connect();
  }

  async connect() {
    this.connection = await amqp.connect('amqp://localhost');
    this.channel = await this.connection.createChannel();
  }

  async close() {
    await this.channel.close();
    await this.connection.close();
  }

  async send(queue: string, message: string) {
    await this.connect();
    await this.channel.assertQueue(queue, { durable: true });
    console.log('sending', message);
    const result = this.channel.sendToQueue(queue, Buffer.from(message), {
      persistent: true,
    });
    await this.close();
    return result;
  }

  async consume(queue: string) {
    await this.connect();

    let message: string;
    await this.channel.assertQueue(queue, { durable: true });
    await this.channel.consume(
      queue,
      (msg) => {
        message = msg.content.toString();
      },
      { noAck: true },
    );
    console.log('consuming', message);

    await this.close();
    return message;
  }
}
