const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userModel = require("../server/models/user.model");
const bcrypt = require("bcrypt");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email", // Specify the field to use for the username
      passwordField: "password",
    },
    async (email, password, done) => {
      const user = await userModel.findOne({ email: email });
      try {
        // IF USER NOT FOUND
        if (!user) return done(null, false, { message: "User not exist" });
        // IF PASSWORD NOT MATCH
        const userPassword = await bcrypt.compare(password, user.password);
        if (!userPassword) {
          return done(null, false, { message: "PASSWORD DOSE NOT MATCH !" });
        }
        // IF USERNAME & PASSWORD MATCH
        return done(null, user, { message: "LOGGED IN" });
      } catch (error) {
        return done(error);
      }
    }
  )
);

// used to serialize the user for the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});
