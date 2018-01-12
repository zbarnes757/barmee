import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import * as createError from 'http-errors';
import User from '../models/user';
import { NextFunction, Request, Response } from 'express';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'kitty-kats';

router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await new User()
      .forge({ email: req.body.email, password: req.body.password })
      .save();
    const token = jwt.sign({ id: user.get('id') }, JWT_SECRET, { expiresIn: '1 day' });

    res.status(201);
    res.json({ token });
    next();
  } catch (error) {
    return next(createError(400, 'Please provide valid params for user creation.'));
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const user = await new User()
      .forge({ email: req.body.email })
      .fetch();

    if (!user) {
      console.log("no user found with email");
      return createError(404, `No user found with email: ${req.body.email}`);
    } else {
      const passwordsMatch = await user.comparePassword(req.body.password);
      if (passwordsMatch) {
        const token = jwt.sign({ id: user.get('id') }, JWT_SECRET, { expiresIn: '1 day' });
        console.log("got a match");
        res.json({ token });
        return res;
      } else {
        console.log(req.body.email, req.body.password);
        return createError(401, 'Invalid email/password combination.');
      }
    }
  } catch (error) {
    console.log(error);
    return createError(401, 'Unable to log this user in.');
  }
});

module.exports = router;
