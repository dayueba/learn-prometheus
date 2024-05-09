import {Configuration, App, ILifeCycle} from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import { join } from 'path';
// import { DefaultErrorFilter } from './filter/default.filter';
// import { NotFoundFilter } from './filter/notfound.filter';
import { ReportMiddleware } from './middleware/report.middleware';
import * as prometheus from '@midwayjs/prometheus';
const client = require('prom-client');
// let gateway = new client.Pushgateway('http://127.0.0.1:9091');
const gateway = new client.Pushgateway('http://pushgateway:9091');
const os = require('os');

@Configuration({
  imports: [
    koa,
    validate,
    prometheus,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class MainConfiguration implements ILifeCycle{
  @App('koa')
  app: koa.Application;

  async onReady() {
    // add middleware
    this.app.useMiddleware([ReportMiddleware]);
    // add filter
    // this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);

    setInterval(() => {
      gateway.push({ jobName: os.hostname(), groupings: {
        'instance': os.hostname() // 重要
        } })
        .then(({resp, body}) => {
          console.log('push success')
        })
        .catch(err => {
          console.log('push err', err)
        }); //Overwrite all metrics (use PUT)
    }, 1000)
  }


  async onStop(): Promise<void> {
    // 容器退出后删除数据
    await gateway.delete({ jobName: os.hostname() })
      .then(({resp, body}) => {
        /* ... */
        console.log('delete success')
      })
      .catch(err => {
        /* ... */
        console.log('delete fail')
      }); //Delete all metrics for jobName
  }
}
