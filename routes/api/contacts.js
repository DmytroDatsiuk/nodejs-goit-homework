const express = require("express");

const {
  getContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
} = require("../../controller/controllers");

const router = express.Router();
const { validateBody } = require("../../utils/validateBody");

const {
  createContactsValidationSchema,
  updateContactsValidationSchema,
} = require("../../utils/validation/contactsValidationSchemas");

router.get("/", getContacts);

router.get("/:id", getContactById);

router.post("/", validateBody(createContactsValidationSchema), createContact);

router.patch(
  "/:id",
  validateBody(updateContactsValidationSchema),
  updateContact
);

router.delete("/:id", deleteContact);

module.exports = { contactRouter: router };
