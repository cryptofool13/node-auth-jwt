const jwt = require("jwt-simple");

const User = require("../models/user");
const config = require("../config");

function tokenForUser(user) {
  const timestamp = new Date().getTime();

  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = (req, res, next) => {
  res.send({ token: tokenForUser(req.user) });
};

exports.signup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res
      .status(422)
      .send({ error: "you must provide email and password" });
  }
  // see if user with given email exists
  User.findOne({ email: email }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (user) {
      return res.status(422).send({ error: "email already in use" });
    }
    // if emai does exist, return an error
    const newUser = new User({
      email: email,
      password: password
    });

    newUser.save(err => {
      if (err) {
        return next(err);
      }
      res.json({ token: tokenForUser(newUser) });
    });
    // if email doesnt exist,
  });
};
