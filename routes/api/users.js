const express = require("express");
const { tryCatchWrapper } = require("../../helpers/index");
const {
  register,
  login,
  logout,
  currentUser,
  uploadImage,
} = require("../../controller/auth.controller");
const { validateBody, auth, upload } = require("../../middlewares/index");
const { authShema } = require("../../shemas/contacts");

const authRouter = express.Router();

authRouter.post("/singup", validateBody(authShema), tryCatchWrapper(register));
authRouter.post("/login", validateBody(authShema), tryCatchWrapper(login));
authRouter.post("/logout", auth, tryCatchWrapper(logout));
authRouter.get("/current", auth, tryCatchWrapper(currentUser));
authRouter.patch(
  "/avatars",
  auth,
  upload.single("image"),
  tryCatchWrapper(uploadImage)
);

module.exports = {
  authRouter,
};
