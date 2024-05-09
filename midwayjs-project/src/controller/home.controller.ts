import { Controller, Get, ILogger, Inject } from '@midwayjs/core';
import { DataService } from '@midwayjs/prometheus';
import {
  BadRequestError,
  InternalServerErrorError,
  UnauthorizedError,
} from '@midwayjs/core/dist/error/http';
import { Context } from '@midwayjs/koa';
// import atomicSleep from 'atomic-sleep';
// import axios from 'axios';
// const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

@Controller('/')
export class HomeController {
  @Inject()
  dataService: DataService;

  @Inject()
  logger: ILogger;

  @Inject()
  ctx: Context;

  @Get('/')
  async home() {
    console.log(this.ctx.headers);
    return 1231231;
  }

  @Get('/500')
  async a(): Promise<string> {
    throw new InternalServerErrorError('500');
  }

  @Get('/400')
  async b(): Promise<string> {
    throw new BadRequestError('400');
  }
  @Get('/401')
  async c() {
    throw new UnauthorizedError('401');
  }

  @Get('/data')
  async metric() {
    return this.dataService.getData();
  }
}
