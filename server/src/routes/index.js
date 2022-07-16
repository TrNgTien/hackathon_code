const userRouter = require('./user');
const authRouter = require('./auth');
const requestRouter = require('./request');
const commentRouter = require('./comment');
const postRouter = require('./post');
const scrapperRouter = require('./scrapper');

function route(app) {
  app.use('/post', postRouter);
  app.use('/comment', commentRouter);
  app.use('/request', requestRouter);
  app.use('/auth', authRouter);
  app.use('/user', userRouter);
  app.use('/scrapper', scrapperRouter);
  
}
module.exports = route;