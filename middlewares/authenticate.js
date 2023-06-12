const jwt = require("jsonwebtoken");
const HttpError = require("../utils/HttpError");

const { User } = require("../models/user");

const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    return next(new HttpError(401, "Unathorized"));
  }
  try {
    const { id } = jwt.verify(token, SECRET_KEY);

    const user = await User.findById(id);
    if (!user || !user.token) {
      return next(new HttpError(401, "Unathorized"));
    }
    req.user = user;
    next();
  } catch (error) {
    return next(new HttpError(401, "Unathorized"));
  }
};

module.exports = { authenticate };
