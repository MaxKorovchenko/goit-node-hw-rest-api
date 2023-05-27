const { controllerWrapper } = require("../helpers/controllerWrapper");
const { HttpError } = require("../helpers/HttpError");

const { Contact } = require("../models/contact");

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 5 } = req.query;
  const skip = (page - 1) * limit;
  const contacts = await Contact.find({ owner }, "-createdAt -updatedAt", { skip, limit }).populate(
    "owner",
    "name email"
  );

  res.status(200).json(contacts);
};

const getContact = async (req, res) => {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);

  if (!contact) {
    throw new HttpError(404, "Contact not found");
  }

  res.status(200).json(contact);
};

const addContact = async (req, res) => {
  const { _id: owner } = req.user;
  const newContact = await Contact.create({ ...req.body, owner });

  res.status(201).json(newContact);
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const contact = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
  if (!contact) {
    throw new HttpError(404, "Contact not found");
  }

  res.status(200).json(contact);
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const contact = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
  if (!contact) {
    throw new HttpError(404, "Contact not found");
  }

  res.status(200).json(contact);
};

const removeContact = async (req, res) => {
  const { contactId } = req.params;
  const contact = await Contact.findByIdAndRemove(contactId);
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
  updateStatusContact: controllerWrapper(updateStatusContact),
  removeContact: controllerWrapper(removeContact),
};
