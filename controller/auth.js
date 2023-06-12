const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const Jimp = require("jimp");
const fs = require("fs/promises");
const crypto = require("crypto");

const { User } = require("../models/user");
const HttpError = require("../utils/HttpError");
const { updateUserSubscriptionService } = require("../services/authService");
const sendEmail = require("../helpers/sendEmail");
const { SECRET_KEY, PROJECT_URL } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

async function register(req, res, next) {
  const { email, password } = req.body;
  const currentUser = await User.findOne({ email });

  try {
    if (currentUser) {
      return res.status(409).json({ message: "Email in use" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomUUID();

    const avatarURL = gravatar.url(email);

    const createUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
      verificationToken,
    });

    const verifyEmail = {
      to: email,
      subject: "verify email",
      html: `<a target='_blank' href='${PROJECT_URL}/users/verify/${verificationToken}'>Click to verify email</a>`,
    };

    await sendEmail(verifyEmail);

    const { _id: id } = createUser;

    const payload = {
      id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

    return res.status(201).json({
      token,
      user: { email: createUser.email, password: createUser.password },
    });
  } catch (error) {
    return next(error);
  }
}

async function verify(req, res, next) {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });

  if (!user) {
    res.status(404).json({ message: "Not found" });
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });

  res.status(200).json({
    message: "Verify saccess",
  });
}

async function resendVerifyEmail(req, res, next) {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404).json({ message: "Not found" });
  }

  if (!email) {
    res.status(400).json({ message: "missing required field email" });
  }

  if (user.verify) {
    res.status(400).json({ message: "Verification has already been passed" });
  }

  const verifyEmail = {
    to: email,
    subject: "verify email",
    html: `<a target='_blank' href='${PROJECT_URL}/users/verify/${user.verificationToken}'>Click to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(200).json({
    message: "Verify resend on your email",
  });
}

async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !user.verify) {
      throw new HttpError(409, "Email in use");
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
  verify,
  resendVerifyEmail,
  login,
  getCurrent,
  logout,
  updateSubcription,
  updateAvatar,
};
