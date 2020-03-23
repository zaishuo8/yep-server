export default app => {
  app.beforeStart(async () => {
    app.validator.addRule('isPhoneNumber', /^1\d{10}$/);
  });
};
