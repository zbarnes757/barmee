import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import User from '../models/user';
import { NextFunction, Request, Response } from 'express';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'kitty-kats';

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const user = await User
      .forge({ email: req.body.email, password: req.body.password })
      .save();
    const token = jwt.sign({ id: user.get('id') }, JWT_SECRET, { expiresIn: '1 day' });

    res.status(201);
    res.json({ token });
  } catch (error) {
    res.status(400).send('Please provide valid params for user creation.');
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const user = await User
      .forge({ email: req.body.email })
      .fetch();

    if (!user) {
      res.status(404).send(`No user found with email: ${req.body.email}`);
    } else {
      const passwordsMatch = await user.comparePassword(req.body.password);
      if (passwordsMatch) {
        const token = jwt.sign({ id: user.get('id') }, JWT_SECRET, { expiresIn: '1 day' });

        res.json({ token });
      } else {
        res.status(401).send('Invalid email/password combination.');
      }
    }
  } catch (error) {
    res.status(401).send('Unable to log this user in.');
  }
});

module.exports = router;
