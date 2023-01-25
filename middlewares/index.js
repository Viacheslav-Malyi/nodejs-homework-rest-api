const { Unauthorized, BadRequest } = require("http-errors");
const jwt = require("jsonwebtoken");
const { User } = require("./../models/user");

function validateBody(shema) {
  return (req, res, next) => {
    const { error } = shema.validate(req.body);
    if (error) {
      return next(BadRequest(error.message));
    }
    return next();
  };
}

async function auth(req, res, next) {
  const authHeaders = req.headers.authorization || "";
  const [type, token] = authHeaders.split(" ");
  if (type !== "Bearer") {
    next(Unauthorized("Not authorized"));
    return;
  }
  if (!token) {
    next(Unauthorized("Not authorized"));
  }
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id);
    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return next(Unauthorized("jwt token is not valid"));
    }
    throw error;
  }
}

module.exports = {
  validateBody,
  auth,
};
