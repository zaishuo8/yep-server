import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/test', controller.home.test);

  router.get('/community', controller.home.getAllCommunities);
  router.post('/community', controller.home.insertCommunity);

  router.post('/user/sms_code', controller.user.smsCode);
  router.post('/user/login', controller.user.login);

  router.post('/posting', controller.posting.submitPosting);
  router.get('/posting', controller.posting.getPostings);
  router.post('/posting/comment', controller.posting.submitComment);
  router.get('/posting/comment', controller.posting.getComments);
};
