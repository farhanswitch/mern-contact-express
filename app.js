const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const passport = require("passport");
const cookieSession = require("cookie-session");

const googleRoute = require("./utilities/routes/googleRoutes");
const { client } = require("./utilities/connect-db");
const usersRoutes = require("./routes/usersRoutes");

const {
  loadAllUser,
  findUser,
  addUser,
  updateUser,
  deleteUser,
} = require("./utilities/manage-users");
const { decrypt } = require("./utilities/aes");
const { generateJWT, verifyJWT } = require("./utilities/manage-jwt");
const {
  loadContacts,
  findContact,
  updateContact,
  deleteContact,
  addContact,
} = require("./utilities/manage-contacts");
const {
  comparePassword,
  validatingUserData,
  validatingEditUser,
  validatingContact,
} = require("./utilities/validation");
const PORT = 4000;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(
  cookieSession({
    name: "session",
    keys: ["fs-session"],
    maxAge: 15 * 60,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/auth1", googleRoute);
app.use("/users", usersRoutes);
//route
//check api
app.get("/check", (req, res) => {
  res.json({ msg: "ok" });
});
//root
app.get("/", (req, res) => {
  res.json({ msg: "Success" });
});

//handle authenticating user
app.get("/auth", verifyJWT, async (req, res) => {
  await client.connect();
  const user = await findUser("_id", req?.userId);

  res.json({ id: req?.userId, name: user?.name, user: req?.userData });
});
//handle get all contact
app.get("/contacts", verifyJWT, async (req, res) => {
  await client.connect();
  const contacts = await loadContacts();
  res.json({ msg: "ok", contacts, user: req?.userData });
});
//handle get spesific user by id
app.get("/contacts/:id", verifyJWT, async (req, res) => {
  await client.connect();
  const { id } = req.params;
  const contact = await findContact("_id", id);
  res.json({
    contact,
    role: req.userData.role,
  });
});

//handle new contact
app.post("/contacts/add/", verifyJWT, (req, res) => {
  if (req.userData.role !== 1 && req.userData?.role !== 2) {
    res.status(403).send("Forbidden");
  } else {
    const contact = req.body;
    validatingContact(contact).then((errors) => {
      console.log(errors);
      const objOfError = errors.map((error) => {
        return { msg: error };
      });
      if (errors.length === 0) {
        addContact(contact).then((result) => {
          res.json({ statusMsg: "Success", msg: "New contact has been added" });
        });
      } else {
        res.json({
          statusMsg: "Error",
          errors: objOfError,
        });
      }
    });
  }
});

//handle edit contact
app.patch("/contacts/edit/", verifyJWT, (req, res) => {
  if (req.userData.role !== 1 && req.userData?.role !== 2) {
    res.status(403).send("Forbidden");
  } else {
    const contact = req.body;
    validatingContact(contact).then((errors) => {
      if (errors.length === 0) {
        updateContact(contact).then((updatedCount) => {
          if (updatedCount === 1) {
            res.json({ msg: "Contact Edited", statusMsg: "Success" });
          } else {
            res.json({
              msg: "Contact is exists",
              statusMsg: "Nothing changed",
            });
          }
        });
      } else {
        res.json({
          statusMsg: "Error",
          msg: `Details : ${errors}`,
        });
      }
    });
  }
});
//handle logging out user
app.delete("/users/logout", verifyJWT, (req, res) => {
  res.clearCookie("fstoken").json({ msg: "logged-out" });
});
//handle delete contact
app.delete("/contacts/delete/:id", verifyJWT, async (req, res) => {
  if (req.userData.role !== 1) {
    res.status(403).send("Forbidden");
  } else {
    const { id } = req.params;
    const deletedCount = await deleteContact("_id", id);

    if (deletedCount === 1) {
      res.json({ msg: "ok" });
    } else if (!deletedCount) {
      res.json({ msg: "error" });
    }
  }
});
//start the server
app.listen(PORT, () =>
  console.log(`Backend can be accesses via http://localhost:${PORT}`)
);
