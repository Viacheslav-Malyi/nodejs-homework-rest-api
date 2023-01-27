function tryCatchWrapper(enpointFn) {
  return async (res, req, next) => {
    try {
      await enpointFn(res, req, next);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = {
  tryCatchWrapper,
};
