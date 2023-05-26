const express = require("express");

const {
  getAllContacts,
  getContact,
  addContact,
  updateContact,
  removeContact,
  updateStatusContact,
} = require("../../controllers/contactsControllers");

const { validateBody } = require("../../middlewares/validateBody");
const { contactAddSchema, updateFavoriteSchema } = require("../../schemas/contactSchemas");
const { isValidId } = require("../../middlewares/isValidId");

const router = express.Router();

router.get("/", getAllContacts);

router.get("/:contactId", isValidId, getContact);

router.post("/", validateBody(contactAddSchema), addContact);

router.put("/:contactId", isValidId, validateBody(contactAddSchema), updateContact);

router.patch("/:contactId/favorite", isValidId, validateBody(updateFavoriteSchema), updateStatusContact);

router.delete("/:contactId", isValidId, removeContact);

module.exports = {
  contactsRouter: router,
};
