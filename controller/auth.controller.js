const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs/promises");
const gravatar = require("gravatar");
const jimp = require("jimp");
const { Conflict, Unauthorized } = require("http-errors");
const { User } = require("../models/user");

const { JWT_SECRET } = process.env;

async function register(req, res, next) {
  const { email, password } = req.body;

  const avatarURL = gravatar.url(
    email,
    {
      s: "250",
      d: "retro",
    },
    true
  );
  console.log("AVATAR", avatarURL);
  try {
    const savedUser = await User.create({
      email,
      password,
      avatarURL,
    });

    res.status(201).json({
      data: {
        user: {
          email,
          avatarURL,
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

async function uploadImage(req, res, next) {
  const { filename } = req.file;
  const tmpPath = path.resolve(__dirname, "../tmp", filename);

  const image = await jimp.read(tmpPath);
  await image.resize(250, 250);
  await image.writeAsync(tmpPath);

  const publicPath = path.resolve(__dirname, "../public/avatars", filename);

  try {
    await fs.rename(tmpPath, publicPath);

    const { _id } = req.user;
    const result = await User.findByIdAndUpdate(
      _id,
      { avatarURL: `/public/avatars/${filename}` },
      { new: true }
    );
    res.json({
      avatar: result.avatarURL,
    });
  } catch (error) {
    await fs.unlink(tmpPath);
    throw Unauthorized("Not authorized");
  }
}

module.exports = {
  register,
  login,
  logout,
  currentUser,
  uploadImage,
};
