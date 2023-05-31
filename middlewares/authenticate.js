const jwt = require("jsonwebtoken");
// const { HttpError } = require("../utils/HttpError");

const { User } = require("../models/user");
const { httpError } = require("../helpers/index");

const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    // throw new HttpError(401, "Unathorized");
    next(httpError(401));
    // next(new HttpError(401, "Unathorized"));
  }
  try {
    const { id } = jwt.verify(token, SECRET_KEY);

    const user = await User.findById(id);
    if (!user || !user.token) {
      //   throw new HttpError(401, "Unathorized");
      //   next(new HttpError(401, "Unathorized"));

      next(httpError(401));
    }
    req.user = user;
    next();
  } catch (error) {
    // throw new HttpError(401, "Unathorized");
    next(httpError(401));
    // next(new HttpError(401, "Unathorized"));
  }
};

module.exports = { authenticate };
