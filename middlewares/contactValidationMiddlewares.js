const { validatingContact } = require("../utilities/validation");

const MidContact = async (req, res, next) => {
  // console.log(req.userData.role, "zz");
  if (req.userData.role !== 1 && req.userData?.role !== 2) {
    res.json({
      statusMsg: "Error",
      errors: [{ msg: "Forbidden" }],
    });
  } else {
    const contact = req.body;
    console.log(contact, "xx");
    if (Object.keys(contact).length === 0) {
      res.json({
        statusMsg: "Error",
        errors: [{ msg: "uncomplete data" }],
      });
    } else {
      const errors = await validatingContact(contact);
      if (errors?.length !== 0) {
        const objOfError = errors.map((error) => {
          return { msg: error };
        });
        res.json({
          statusMsg: "Error",
          errors: objOfError,
        });
      } else {
        req.contact = contact;
        next();
      }
    }
  }
};

const MidDeleteContact = (req, res, next) => {
  if (req?.userData?.role !== 1) {
    res.json({ statusMsg: "Error", errors: [{ msg: "Forbidden" }] });
  } else {
    next();
  }
};
module.exports = { MidContact, MidDeleteContact };
