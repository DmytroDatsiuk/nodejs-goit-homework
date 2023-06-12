const { User } = require("../models/user");
const HttpError = require("../utils/HttpError");

const updateUserSubscriptionService = async (contactID, body) => {
  const sibscription = await User.findByIdAndUpdate(contactID, body, {
    new: true,
  });
  if (!sibscription) {
    throw new HttpError(404, "sibscription not found");
  }
  return sibscription;
};

module.exports = { updateUserSubscriptionService };
