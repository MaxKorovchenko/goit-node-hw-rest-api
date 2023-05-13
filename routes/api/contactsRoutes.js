const express = require("express");

const {
  getAllContacts,
  getContact,
  addContact,
  updateContact,
  removeContact,
} = require("../../controllers/contactsControllers");

const { validateBody } = require("../../decorators/validateBody");
const { contactAddSchema } = require("../../schemas/contactsSchemas");

const router = express.Router();

router.route("/").get(getAllContacts).post(validateBody(contactAddSchema), addContact);

router.route("/:contactId").get(getContact).put(validateBody(contactAddSchema), updateContact).delete(removeContact);

module.exports = router;
