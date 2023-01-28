const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Conflict, Unauthorized } = require("http-errors");
const { User } = require("../models/user");

const { JWT_SECRET } = process.env;

async function register(req, res, next) {
  const { email, password } = req.body;

  const sult = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, sult);
  try {
    const savedUser = await User.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      data: {
        user: {
          email,
          id: savedUser._id,
        },
      },
    });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error")) {
      throw Conflict("User with this email already exist");
    }
    throw error;
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;
  console.log("=++++++++++++++++++==", req);

  const sortedUser = await User.findOne({
    email,
  });

  if (!sortedUser) {
    throw Unauthorized("Email or password is wrong");
  }

  const isPasswordValid = await bcrypt.compare(password, sortedUser.password);
  if (!isPasswordValid) {
    throw Unauthorized("Email or password is wrong");
  }

  const token = jwt.sign({ id: sortedUser._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  await User.findByIdAndUpdate(sortedUser._id, { token });

  res.json({
    token,
    user: {
      email,
      subscription: "starter",
    },
  });
}

async function logout(req, res, next) {
  const { _id } = req.user;
  const result = await User.findByIdAndUpdate(_id, { token: "" });
  if (!result) {
    throw Unauthorized("Not authorized");
  }
  res.status(204).json({});
}

async function currentUser(req, res) {
  const { user } = req;
  const { email, subscription } = user;
  res.status(200).json({
    user: {
      email,
      subscription,
    },
  });
}

module.exports = {
  register,
  login,
  logout,
  currentUser,
};
