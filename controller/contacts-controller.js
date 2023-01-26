const express = require("express");
const { HttpError } = require("../helpers/index");
const router = express.Router();

const httpError = new HttpError();
const { Contact } = require("../models/contact");

async function getContact(req, res, next) {
  const contacts = await Contact.find({});
  res.status(200).json(contacts);
}

async function getContactId(req, res, next) {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);
  if (!contact) {
    return next(httpError.getError(404, "Not found"));
  }
  return res.status(200).json(contact);
}

async function addNewContact(req, res, next) {
  const { name, email, phone } = req.body;
  console.log("newContact", { name, email, phone });
  const addContacts = await Contact.create({
    name,
    email,
    phone,
  });
  res.status(201).json(addContacts);
}

async function deleteContact(req, res, next) {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);
  if (!contact) {
    return next(httpError.getError(404, "Not found"));
  }
  await Contact.findByIdAndRemove(contactId);
  return res.status(200).json({ message: "contact deleted", contact });
}

async function updteContact(req, res, next) {
  const { contactId } = req.params;
  const updateContac = await Contact.findByIdAndUpdate(contactId, req.body);
  if (!updateContac) {
    res.status(404).json({ message: "Not found" });
  }
  res.status(200).json({ message: "Ok", updateContac });
}

async function updateStatusContact(req, res, next) {
  const { contactId } = req.params;
  const updateStatus = await Contact.findByIdAndUpdate(contactId, req.body);
  if (!updateStatus) {
    res.status(404).json({ message: "Not found" });
  }
  res.status(200).json({ message: "Ok", updateStatus });
}

module.exports = {
  getContact,
  getContactId,
  addNewContact,
  deleteContact,
  updteContact,
  updateStatusContact,
};
