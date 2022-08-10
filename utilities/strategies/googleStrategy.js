require("dotenv").config();
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "710049264768-knjjqv207g5bttnat49r43jnp29id61s.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "/auth1/callback/google",
      scope: ["profile", "email"],
    },
    function (accessToken, refreshToken, profile, callback) {
      callback(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
