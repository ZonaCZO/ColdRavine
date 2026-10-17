import serverless from 'serverless-http';
import { createApp } from './app.js';

let handlerPromise;
export async function handler(event, context) {
  context.callbackWaitsForEmptyEventLoop = false;
  handlerPromise ??= createApp().then(app => serverless(app)).catch(error => {
    handlerPromise = undefined;
    throw error;
  });
  const handle = await handlerPromise;
  return handle(event, context);
}
