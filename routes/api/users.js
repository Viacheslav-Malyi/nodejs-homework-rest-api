const express = require("express");
const { tryCatchWrapper } = require("../../helpers/index");
const {
  register,
  login,
  logout,
  currentUser,
} = require("../../controller/auth.controller");
const { validateBody, auth } = require("../../middlewares/index");
const { authShema } = require("../../shemas/contacts");

const authRouter = express.Router();

authRouter.post("/singup", validateBody(authShema), tryCatchWrapper(register));
authRouter.post("/login", validateBody(authShema), tryCatchWrapper(login));
authRouter.post("/logout", auth, tryCatchWrapper(logout));
authRouter.get("/current", auth, tryCatchWrapper(currentUser));

module.exports = {
  authRouter,
};
