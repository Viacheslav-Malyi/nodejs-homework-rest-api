const { HttpError } = require("../helpers/index");
const err = new HttpError();

function validateBody(shema) {
  return (req, res, next) => {
    const { error } = shema.validate(req.body);
    if (error) {
      return next(err.getError(400, error.message));
    }
    return next();
  };
}

module.exports = {
  validateBody,
};
