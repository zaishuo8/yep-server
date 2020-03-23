import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  // router.get('/test', controller.home.test);
  // router.post('/community', controller.home.insertCommunity);

  router.get('/communities', controller.community.getAllCommunities);

  router.get('/cities', controller.city.getAllCities);

  router.post('/user/sms_code', controller.user.smsCode);
  router.post('/user/login', controller.user.login);

  router.post('/user/cities_communities', controller.user.selectCityCommunity);

  router.post('/posting', controller.posting.submitPosting);
  router.get('/posting', controller.posting.getPostings);
  router.post('/posting/comment', controller.posting.submitComment);
  router.get('/posting/comment', controller.posting.getComments);
};
