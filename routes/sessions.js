const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/user');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'kitty-kats';

router.get('/_current', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.dir(req.user);
  if (req.user) {
    return res.json({ user: req.user });
  }

  return res.boom.unauthorized();
});

router.post('/signup', async (req, res) => {
  try {
    const user = await new User({ email: req.body.email, password: req.body.password }).save();
    const token = jwt.sign({ id: user.get('id') }, JWT_SECRET, { expiresIn: "1 day" });

    res.json({ token });
  } catch (error) {
    res.boom.badRequest();
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await new User({ email: req.body.email}).fetch();

    if (!user) {
      res.boom.notFound(`No user found with email: ${req.body.email}`);
    } else {
      const passwordsMatch = await user.comparePassword(req.body.password);
      if (passwordsMatch) {
        const token = jwt.sign({ id: user.get('id') }, JWT_SECRET, { expiresIn: "1 day" });

        res.json({ token });
      } else {
        res.boom.unauthorized();
      }
    }
  } catch (error) {
    res.boom.unauthorized();
  }
});

module.exports = router;
