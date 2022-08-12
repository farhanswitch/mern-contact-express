const router = require("express").Router();
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

const { verifyJWT } = require("../utilities/manage-jwt");

router.get("/", verifyJWT, MidLoadUsers, async (req, res) => {
  try {
    res.json({ users: await loadUsers(), user: req.userData });
  } catch (error) {
    res.status(500).send(error);
  }
});
router.get("/:id", verifyJWT, async (req, res) => {
  const { id } = req.params;
  res.json({ user: await findUser("_id", id), userData: req.userData });
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
router.patch("/edit/:id", verifyJWT, MidEditUser, async (req, res) => {
  const { id } = req.params;
  // console.log("edit", req.editUser);
  const { name, email, role } = req.editUser;
  try {
    // res.send(await updateUser(id, req.editUser));
    const updatedCount = await updateUser(id, { name, email, role });
    if (updatedCount === 1) {
      res.json({ msg: "User Edited", statusMsg: "Success" });
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
