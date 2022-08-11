const router = require("express").Router();

const { verifyJWT } = require("../utilities/manage-jwt");
const {
  loadContacts,
  findContact,
  addContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");

const {
  MidContact,
  MidDeleteContact,
} = require("../middlewares/contactValidationMiddlewares");

router.get("/", verifyJWT, async (req, res) => {
  const contacts = await loadContacts();
  res.json({ msg: "ok", contacts, user: req?.userData });
});
router.get("/:id", verifyJWT, async (req, res) => {
  const { id } = req.params;
  const contact = await findContact("_id", id);
  res.json({
    contact,
    role: req.userData.role,
  });
});
router.post("/add", verifyJWT, MidContact, async (req, res) => {
  const idNewContact = await addContact(req.contact);
  res.json({ statusMsg: "Success", msg: "New contact has been added" });
});
router.patch("/edit", verifyJWT, MidContact, async (req, res) => {
  const { _id, name, email, phone } = req.contact;
  const updatedCount = await updateContact(_id, { name, email, phone });
  if (updatedCount === 1) {
    res.json({ msg: "Contact Edited", statusMsg: "Success" });
  } else {
    res.json({
      msg: "Contact is exists",
      statusMsg: "Nothing changed",
    });
  }
});
router.delete("/delete/:id", verifyJWT, MidDeleteContact, async (req, res) => {
  const { id } = req.params;
  const deletedCount = await deleteContact(id);

  if (deletedCount === 1) {
    res.json({ msg: "ok" });
  } else if (!deletedCount) {
    res.json({ msg: "error" });
  }
});
module.exports = router;
