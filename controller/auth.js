const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../models/user");
const { HttpError } = require("../utils/HttpError");
const { updateUserSubscriptionService } = require("../services/authService");

const { SECRET_KEY } = process.env;

async function register(req, res, next) {
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  try {
    const currentUser = await User.findOne({ email: newUser.email });

    if (currentUser !== null) {
      return res.status(409).json({ message: "Email in use" });
    }

    newUser.password = await bcrypt.hash(newUser.password, 10);

    User.create(newUser);

    return res.status(201).json(newUser);
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user === null) {
      throw new HttpError(401, "Email or password is wrong");
    }

    const { _id: id } = user;

    const payload = {
      id,
    };

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      throw new HttpError(401, "Email or password is wrong");
    }

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

    await User.findByIdAndUpdate(id, { token });

    res.json({ token: token });
  } catch (error) {
    return next(error);
  }
}

async function getCurrent(req, res, next) {
  const { email, name } = req.user;

  res.json({ email, name });
}

async function logout(req, res, next) {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json({
    message: "Logout success",
  });
}

async function updateSubcription(req, res, next) {
  const { id } = req.params;
  const body = req.body;

  if (!body) {
    throw new HttpError(400, "missing field favorite");
  }

  const updatedSubsription = await updateUserSubscriptionService(id, body);
  res.status(200).json(updatedSubsription);
}

module.exports = { register, login, getCurrent, logout, updateSubcription };
