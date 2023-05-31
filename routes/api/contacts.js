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
const { authenticate } = require("../../middlewares/authenticate");

const {
  createContactsValidationSchema,
  updateContactsValidationSchema,
} = require("../../utils/validation/contactsValidationSchemas");

router.use(authenticate);

router.get("/", authenticate, getContacts);

router.get("/:id", authenticate, getContactById);

router.post(
  "/",
  authenticate,
  validateBody(createContactsValidationSchema),
  createContact
);

router.patch(
  "/:id",
  authenticate,
  validateBody(updateContactsValidationSchema),
  updateContact
);

router.delete("/:id", authenticate, deleteContact);

module.exports = { contactRouter: router };
