const Koa = require('koa');
const { v4: UUID } = require('uuid');
const Logger = require('./utils/koa-logger');
const cors = require('koa2-cors');
const koaBody = require('koa-body');
const cookies = require('koa-cookie').default();
const router = require('./routes');

const init = () => {
  const app = new Koa();
  app.use(cookies);
  // setup request uuid
  app.use((ctx, next) => {
    const uuid = UUID();

    ctx.uuid = uuid;
    return next();
  });
  // log for the api call
  app.use(Logger());
  // set post json limit for image upload and parse multipart body
  app.use(
    koaBody({
      jsonLimit: '2mb',
      multipart: true,
    })
  );
  // cross domain
  const corsOptions = {
    origin: 'https://foody-git-main-cheng-chun-yuan.vercel.app',
    credentials: true,
  };
  app.use(cors(corsOptions));

  // register routers
  app.use(router.routes()).use(router.allowedMethods());

  return app;
};

module.exports = init;
