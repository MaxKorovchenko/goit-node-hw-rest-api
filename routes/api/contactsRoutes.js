const express = require("express");
const { HttpError } = require("../../helpers/HttpError");
const {
  getAllContactsService,
  getContactService,
  addContactService,
  updateContactService,
  removeContactService,
} = require("../../models/contactsService");
const Joi = require("joi");

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const contacts = await getAllContactsService();

    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactService(contactId);
    if (!contact) {
      throw new HttpError(404, "Contact not found");
    }

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      throw new HttpError(400, error.message);
    }
    const newContact = await addContactService(req.body);

    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      throw new HttpError(400, error.message);
    }

    const { contactId } = req.params;
    const contact = await updateContactService(contactId, req.body);
    if (!contact) {
      throw new HttpError(404, "Contact not found");
    }

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await removeContactService(contactId);
    if (!contact) {
      throw new HttpError(404, "Contact not found");
    }

    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
