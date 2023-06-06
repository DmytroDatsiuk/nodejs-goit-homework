const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const Jimp = require("jimp");
const fs = require("fs/promises");

const { User } = require("../models/user");
const { HttpError } = require("../utils/HttpError");
const { updateUserSubscriptionService } = require("../services/authService");
const { SECRET_KEY } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

async function register(req, res, next) {
  const { email, password } = req.body;
  const currentUser = await User.findOne({ email });

  try {
    if (currentUser) {
      return res.status(409).json({ message: "Email in use" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);

    const createUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
    });

    return res.status(201).json({
      email: createUser.email,
      password: createUser.password,
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new HttpError(401, "Email or password is wrong");
    }

    const { _id: id } = user;

    const payload = {
      id,
    };

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
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

async function updateAvatar(req, res, next) {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = await req.file;

  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  await Jimp.read(tempUpload)
    .then((image) => {
      return image
        .autocrop()
        .resize(250, 250, Jimp.RESIZE_BEZIER)
        .write(resultUpload);
    })
    .catch((e) => console.log(e));

  fs.rm(tempUpload);

  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
}

module.exports = {
  register,
  login,
  getCurrent,
  logout,
  updateSubcription,
  updateAvatar,
};
