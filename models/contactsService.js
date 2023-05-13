const fs = require("fs/promises");
const { nanoid } = require("nanoid");
const path = require("path");

const contactsPath = path.join(__dirname, "contacts.json");

const getAllContactsService = async () => {
  const contacts = await fs.readFile(contactsPath);

  return JSON.parse(contacts);
};

const getContactService = async (contactId) => {
  const contacts = await getAllContactsService();
  const contact = contacts.find((contact) => contact.id === contactId);

  return contact || null;
};

const addContactService = async (body) => {
  const contacts = await getAllContactsService();
  const newContact = {
    id: nanoid(),
    ...body,
  };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return newContact;
};

const updateContactService = async (contactId, body) => {
  const contacts = await getAllContactsService();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) return null;

  contacts[index] = {
    id: contactId,
    ...body,
  };

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return contacts[index];
};

const removeContactService = async (contactId) => {
  const contacts = await getAllContactsService();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) return null;

  contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return contactId;
};

module.exports = {
  getAllContactsService,
  getContactService,
  addContactService,
  updateContactService,
  removeContactService,
};
