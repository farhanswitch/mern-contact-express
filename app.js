const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");

const { loadAllUser, findUser, addUser } = require("./utilities/manage-users");
const { decrypt } = require("./utilities/aes");
const { generateJWT, verifyJWT } = require("./utilities/manage-jwt");
const {
  comparePassword,
  validatingUserData,
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

//route
//root
app.get("/", (req, res) => {
  res.json({ msg: "Success" });
});
//get all users
app.get("/users", async (req, res) => {
  res.json({ users: await loadAllUser() });
});
//handle add new user
app.post("/users/add", async (req, res) => {
  const { name, email, password } = req.body;
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
//start the server
app.listen(PORT, () =>
  console.log(`Backend can be accesses via http://localhost:${PORT}`)
);
