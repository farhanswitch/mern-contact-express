const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const passport = require("passport");
const cookieSession = require("cookie-session");

const googleRoute = require("./utilities/routes/googleRoutes");

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
//route
//check api
app.get("/check", (req, res) => {
  res.json({ msg: "ok" });
});
//root
app.get("/", (req, res) => {
  res.json({ msg: "Success" });
});
//get all users
app.get("/users", verifyJWT, async (req, res) => {
  console.log(req.userData);
  res.json({ users: await loadAllUser(), user: req.userData });
});
//handle get spesific user with id
app.get("/users/:id", verifyJWT, async (req, res) => {
  const { id } = req.params;
  console.log(id);
  res.json({ user: await findUser("_id", id), userData: req.userData });
});
//handle authenticating user
app.get("/auth", verifyJWT, async (req, res) => {
  const user = await findUser("_id", req?.userId);

  res.json({ id: req?.userId, name: user?.name, user: req?.userData });
});
//handle get all contact
app.get("/contacts", verifyJWT, async (req, res) => {
  const contacts = await loadContacts();
  res.json({ msg: "ok", contacts, user: req?.userData });
});
//handle get spesific user by id
app.get("/contacts/:id", verifyJWT, async (req, res) => {
  const { id } = req.params;
  const contact = await findContact("_id", id);
  res.json({
    contact,
    role: req.userData.role,
  });
});
//handle add new user
app.post("/users/add", async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);
  const decryptedPassword = decrypt(password);
  const errors = await validatingUserData(name, email, decryptedPassword);
  if (errors.length === 0) {
    const hashedPassword = await bcrypt.hash(decryptedPassword, 10);
    const newUserID = await addUser(name, email, hashedPassword);
    res.json({ statusMsg: "Success", userId: newUserID });
  } else {
    console.log(errors);
    res.json({
      statusMsg: "Error",
      errors,
    });
  }
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
//handle request login
app.post("/users/login/", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  const existingUser = await findUser("email", email);
  if (!existingUser) {
    res.json({
      statusMsg: "Error",
      errors: [{ msg: `There is no account with email ${email}` }],
    });
  } else {
    // console.log(password);

    const isValidPassword = await comparePassword(
      decrypt(password),
      existingUser?.password
    );
    console.log(isValidPassword);
    if (!isValidPassword) {
      res.json({
        statusMsg: "Error",
        errors: [{ msg: "Wrong password" }],
      });
    } else {
      const jwtToken = generateJWT(
        existingUser._id.toString(),
        existingUser.role
      );
      res.cookie("fstoken", jwtToken, { httpOnly: true }).json({
        statusMsg: "Success",
      });
    }
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
//handle edit user
app.patch("/users/edit/", verifyJWT, (req, res) => {
  if (req?.userData?.role !== 1) {
    res.status(403).send("Forbidden");
  } else {
    const { _id, name, email, role } = req.body;
    validatingEditUser(_id, name, email, role).then((errors) => {
      if (errors.length === 0) {
        updateUser(_id, name, email, role).then((updatedCount) => {
          if (updatedCount === 1) {
            res.json({ msg: "User Edited", statusMsg: "Success" });
          } else {
            res.json({ msg: "User is exists", statusMsg: "Nothing changed" });
          }
        });
      } else {
        console.log(errors);
        res.json({
          statusMsg: "Error",
          errors,
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
//handle delete user
app.delete("/users/delete/:id", verifyJWT, async (req, res) => {
  const { id } = req.params;
  console.log(id);
  if (req.userData.role !== 1) {
    res.status(403).send("Forbidden");
  } else {
    const deletedCount = await deleteUser("_id", id);

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
