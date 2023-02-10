const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const schema = mongoose.Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
  },
  avatarURL: {
    type: String,
    default: "",
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, "Verify token is required"],
  },
});

schema.pre("save", async function () {
  const sult = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(this.password, sult);

  this.password = hashedPassword;
});

const User = mongoose.model("user ", schema);

module.exports = {
  User,
};
