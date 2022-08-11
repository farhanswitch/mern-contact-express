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
const contactsRoutes = require("./routes/contactsRoutes");

const { findUser } = require("./controllers/userController");

const { verifyJWT } = require("./utilities/manage-jwt");

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
app.use("/contacts", contactsRoutes);
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
//start the server
app.listen(PORT, () =>
  console.log(`Backend can be accesses via http://localhost:${PORT}`)
);
