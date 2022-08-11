const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const GoogleStrategy = require("../strategies/googleStrategy");
const { findUser, addUser } = require("../../controllers/userController");
const { generateJWT } = require("../manage-jwt");

router.get("/login/success", async (req, res) => {
  if (req?.user) {
    const name = req?.user?.displayName;
    const email = req?.user?._json?.email;
    const user = await findUser("email", email);
    if (user) {
      const jwtToken = generateJWT(user?._id?.toString(), user?.role);
      res
        .cookie("fstoken", jwtToken, { httpOnly: true })
        .redirect("http://localhost:3000/dashboard");
    } else {
      const password = "12345678";
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUserID = await addUser({
        name,
        email,
        password: hashedPassword,
        role: 3,
      });
      const jwtToken = generateJWT(newUserID, 3);
      res
        .cookie("fstoken", jwtToken, { httpOnly: true })
        .redirect("http://localhost:3000/dashboard");
    }

    // console.log(req.user._json.email);
    // res
    //   .status(200)
    //   .json({ error: false, msg: "Successfully logged in", user: req?.user });
  } else {
    res.status(403).json({ error: true, msg: "Not authorized" });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    error: true,
    msg: "Log in failure",
  });
});

router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get(
  "/callback/google",
  passport.authenticate("google", {
    successRedirect: "/auth1/login/success",
    failureRedirect: "/auth1/login/failed",
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("http://localhost:3000/login");
});

module.exports = router;
