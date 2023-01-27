const express = require("express");
const { NotFound } = require("http-errors");
const router = express.Router();

const { Contact } = require("../models/contact");

async function getContact(req, res, next) {
  const { limit, page } = req.query;
  const skip = (page - 1) * limit;
  const contacts = await Contact.find({}).skip(skip).limit(limit);
  res.status(200).json(contacts);
}

async function getContactId(req, res, next) {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);
  if (!contact) {
    return next(NotFound("Not found"));
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
  const contact = await Contact.findByIdAndRemove(contactId);
  if (!contact) {
    return next(
      NotFound(`failure, no contacts with id ${contactId} where found!`)
    );
  }
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
