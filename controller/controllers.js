const {
  listContactsService,
  getContactsByIdService,
  removeContactService,
  addContactService,
  updateContactService,
} = require("../services/contactServices");
const { HttpError } = require("../utils/HttpError");

const controllerWrapper = require("../utils/controllerWrapper");

let getContacts = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite } = req.query;
  const contacts = await listContactsService(page, limit, favorite, owner);
  res.status(200).json(contacts);
};

getContacts = controllerWrapper(getContacts);

const getContactById = controllerWrapper(async (req, res) => {
  const { id } = req.params;
  const contact = await getContactsByIdService(id);

  res.status(200).json(contact);
});

const createContact = controllerWrapper(async (req, res) => {
  // console.log(req.user);
  const { _id: owner } = req.user;
  const newContact = await addContactService({ ...req.body, owner });
  return res.status(201).json(newContact);
});

const deleteContact = controllerWrapper(async (req, res) => {
  const { id } = req.params;
  await removeContactService(id);
  res.status(200).json({ id });
});

const updateContact = controllerWrapper(async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  if (!body) {
    throw new HttpError(400, "missing field favorite");
  }
  const updatedContact = await updateContactService(id, body);
  res.status(200).json(updatedContact);
});

module.exports = {
  getContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
};
