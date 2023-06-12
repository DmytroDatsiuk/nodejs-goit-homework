const Contacts = require("../models/contacts");
const HttpError = require("../utils/HttpError");

const listContactsService = async (page, limit, favorite, owner) => {
  const skip = (page - 1) * limit;
  const filter = {};
  if (favorite === "true") {
    filter.favorite = true;
  } else if (favorite === "false") {
    filter.favorite = false;
  }
  return await Contacts.find({ owner }, filter)
    .populate("owner", "email name")
    .limit(limit)
    .skip(skip);
};

const getContactsByIdService = async (contactId) => {
  const contact = await Contacts.findById(contactId);
  if (!contact) {
    throw new HttpError(404, "Contact not found");
  }
  return contact;
};

const removeContactService = async (contactId) => {
  const contact = await Contacts.findByIdAndDelete(contactId);
  if (!contact) {
    throw new HttpError(404, "Contact not found");
  }
  return contact;
};

const addContactService = async (body) => {
  return await Contacts.create(body);
};

const updateContactService = async (contactID, body) => {
  const task = await Contacts.findByIdAndUpdate(contactID, body, { new: true });
  if (!task) {
    throw new HttpError(404, "task not found");
  }

  return task;
};

module.exports = {
  listContactsService,
  getContactsByIdService,
  removeContactService,
  addContactService,
  updateContactService,
};
