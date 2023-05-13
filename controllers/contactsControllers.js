const { controllerWrapper } = require("../decorators/controllerWrapper");
const { HttpError } = require("../helpers/HttpError");

const {
  getAllContactsService,
  getContactService,
  addContactService,
  updateContactService,
  removeContactService,
} = require("../models/contactsService");

const getAllContacts = async (req, res) => {
  const contacts = await getAllContactsService();

  res.status(200).json(contacts);
};

const getContact = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactService(contactId);
  if (!contact) {
    throw new HttpError(404, "Contact not found");
  }

  res.status(200).json(contact);
};

const addContact = async (req, res) => {
  const newContact = await addContactService(req.body);

  res.status(201).json(newContact);
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const contact = await updateContactService(contactId, req.body);
  if (!contact) {
    throw new HttpError(404, "Contact not found");
  }

  res.status(200).json(contact);
};

const removeContact = async (req, res) => {
  const { contactId } = req.params;
  const contact = await removeContactService(contactId);
  if (!contact) {
    throw new HttpError(404, "Contact not found");
  }

  res.status(200).json({ message: "contact deleted" });
};

module.exports = {
  getAllContacts: controllerWrapper(getAllContacts),
  getContact: controllerWrapper(getContact),
  addContact: controllerWrapper(addContact),
  updateContact: controllerWrapper(updateContact),
  removeContact: controllerWrapper(removeContact),
};
