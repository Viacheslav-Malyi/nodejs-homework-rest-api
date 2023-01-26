function tryCatchWrapper(enpointFn) {
  return async (res, req, next) => {
    try {
      await enpointFn(res, req, next);
    } catch (error) {
      return next(error);
    }
  };
}

class HttpError {
  getError(status, message) {
    const err = new Error(message);
    err.status = status;
    console.log("13", err);
    return err;
  }
}

module.exports = {
  tryCatchWrapper,
  HttpError,
};
