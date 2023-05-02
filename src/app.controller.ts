import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  index() {
    return { message: 'This is omar and hani' };
  }

  @Post()
  async send(@Body('message') message: string, @Body('queue') queue: string) {
    await this.appService.send(queue, message);
  }

  @Get('consume')
  @Render('consumer')
  async consume() {
    const message1 = await this.appService.consume('q1');
    const message2 = await this.appService.consume('q2');

    return { message: message1 + '\n' + message2 };
  }
}
