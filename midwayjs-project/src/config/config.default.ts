import { MidwayConfig } from '@midwayjs/core';
const os = require('os')

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1711071531802_9309',
  koa: {
    port: 7002,
  },
  prometheus: {
    labels: {
      APP_NAME: 'demo_project',
      NODE_APP_INSTANCE: os.hostname(),
    },
  },
  midwayLogger: {
    default: {
      transports: {
        console: {},
        file: {
          dir: 'logs/pisces/info',
        },
        error: false,
      },
      maxSize: '100m',
      maxFiles: '1d',
      level: 'info',
      consoleLevel: false,
    },
  },
} as MidwayConfig;
