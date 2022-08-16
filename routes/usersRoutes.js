const router = require("express").Router();
const bcrypt = require("bcrypt");
const {
  addUser,
  loadUsers,
  updateUser,
  deleteUser,
  findUser,
} = require("../controllers/userController");

const {
  MidEditUser,
  MidLoadUsers,
  MidAddUser,
  MidDeleteUser,
  MidLoginUser,
} = require("../middlewares/userValidationMiddlewares");
const { decrypt } = require("../utilities/aes");

const { verifyJWT } = require("../utilities/manage-jwt");
const { comparePassword } = require("../utilities/validation");

router.get("/", verifyJWT, MidLoadUsers, async (req, res) => {
  try {
    res.json({ users: await loadUsers(), user: req.userData });
  } catch (error) {
    res.status(500).send(error);
  }
});
router.get("/:id", verifyJWT, MidLoadUsers, async (req, res) => {
  const { id } = req.params;
  if (!id || id.length < 12) {
    res.json({ statusMsg: "Error", errors: [{ msg: "Invalid user id" }] });
  } else {
    res.json({ user: await findUser("_id", id), userData: req.userData });
  }
});
router.post("/add", MidAddUser, async (req, res) => {
  try {
    console.log(req.addUser);
    const { name, email, hashedPassword } = req.addUser;
    const userId = await addUser({
      name,
      email,
      password: hashedPassword,
      role: 3,
    });
    res.json({ statusMsg: "Success", userId });
  } catch (error) {
    res.status(500).send(error);
  }
});
router.post("/login", MidLoginUser, (req, res) => {
  res.cookie("fstoken", req.JWTLogin, { httpOnly: true }).json({
    statusMsg: "Success",
  });
});
router.patch("/edit/password", verifyJWT, async (req, res) => {
  const { id, password, newPassword } = req?.body;
  const decryptedPassword = decrypt(password);
  console.log(decryptedPassword);
  const user = await findUser("_id", id);
  if (!user) {
    res.json({
      statusMsg: "Error",
      msg: "Wrong user id",
    });
  } else {
    console.log(user.password);
    const isValidPassword = await comparePassword(
      decryptedPassword,
      user.password
    );
    console.log(isValidPassword);
    if (!isValidPassword) {
      res.json({
        statusMsg: "Error",
        msg: "Wrong password",
      });
    } else {
      const decryptedNewPassword = decrypt(newPassword);
      const hashedNewPassword = await bcrypt.hash(decryptedNewPassword, 10);
      const updatedCount = await updateUser(id, {
        password: hashedNewPassword,
      });
      if (updatedCount === 1) {
        res.json({ msg: "Password has been edited", statusMsg: "Success" });
      } else {
        res.json({
          msg: "Password is not changed",
          statusMsg: "Nothing changed",
        });
      }
    }
  }
});
router.patch("/edit/:id", verifyJWT, MidEditUser, async (req, res) => {
  const { id } = req.params;
  // console.log("edit", req.editUser);
  const { name, email, role } = req.editUser;
  try {
    // res.send(await updateUser(id, req.editUser));
    const updatedCount = await updateUser(id, { name, email, role });
    if (updatedCount === 1) {
      res.json({ msg: "User has been edited", statusMsg: "Success" });
    } else {
      res.json({ msg: "User is exists", statusMsg: "Nothing changed" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/delete/:id", verifyJWT, MidDeleteUser, async (req, res) => {
  const { id } = req.params;

  try {
    // res.send(await deleteUser(id));
    const deletedCount = await deleteUser(id);
    console.log(deletedCount);
    if (deletedCount === 1) {
      res.json({ msg: "ok" });
    } else if (!deletedCount) {
      res.json({ msg: "error" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});
router.delete("/logout", (req, res) => {
  res.clearCookie("fstoken").json({ msg: "logged-out" });
});

module.exports = router;
