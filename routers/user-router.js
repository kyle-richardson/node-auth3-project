const express = require("express");

const Users = require("../models/user-model.js");
const bcrypt = require("bcryptjs");
const restricted = require("../auth/restricted");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../auth/secrets");

const router = express.Router();

router.get("/users", restricted, async (req, res) => {
  const token = req.headers.authorization;
  try {
    const users = await Users.findAllBy({ department: matchDepartment(token) });
    res.status(201).json(users);
  } catch (err) {
    res.status(501).json({ message: "could not retrieve users", error: err });
  }
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  Users.findBy({ username })
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        /* JWT auth */
        const token = generateToken(user);

        /*For part 2 session*/
        // req.session.user=user

        res
          .status(200)
          .json({ message: `Welcome ${user.username}!`, token: token });
      } else {
        res.status(401).json({ message: "You shall not pass!" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "failed to sign in", error: err });
    });
});

router.get("/logout", restricted, (req, res) => {
  res.status(200).json({ message: `Logout success` });
});

router.post("/register", verifyNewUser, async (req, res) => {
  const { username, password } = req.body;
  try {
    const hash = bcrypt.hashSync(password, 14);
    const newUser = await Users.add({ username: username, password: hash });
    res.status(200).json(newUser);
  } catch {
    res.status(501).json({ message: "could not add user" });
  }
});

router.delete("/users/:id", restricted, (req, res) => {
  const { id } = req.params;
  Users.remove(id)
    .then(deletedUser => {
      res.status(200).json(deletedUser);
    })
    .catch(err => {
      res.status(501).json({ message: "could not delete user", error: err });
    });
});

router.put("/users/:id", restricted, verifyChanges, async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;
  try {
    let updatedUser;
    if (password) {
      const newPass = bcrypt.hashSync(password, 14);
      updatedUser = await Users.update(id, {
        username: username,
        password: newPass
      });
    } else updatedUser = await Users.update(id, { username: username });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "could not update user info", error: err });
  }
});

function verifyChanges(req, res, next) {
  const changes = req.body;
  if (changes.username) next();
  else
    res.status(400).json({
      message:
        "username field required to make changes (even if it is not changed)"
    });
}

function verifyNewUser(req, res, next) {
  const { username, password } = req.body;
  if (username && password) {
    Users.findBy({ username }).then(user => {
      if (user) res.status(400).json({ message: "username already in use" });
      else next();
    });
  } else
    res.status(400).json({ message: "username and password fields required" });
}

/* used for token auth */
function generateToken(user) {
  const payload = {
    subject: user.id, //subject is renamed as sub when produced
    username: user.username,
    department: user.department
  };
  const secret = jwtSecret;
  const options = {
    expiresIn: "1h"
  };
  return jwt.sign(payload, secret, options);
}

function matchDepartment(token) {
  let dptment = null;
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
        //do nothing
      } else {
        dptment = decodedToken.department;
      }
    });
  }
  return dptment;
}

module.exports = router;
