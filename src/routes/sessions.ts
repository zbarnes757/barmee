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

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await new User()
      .forge({ email: req.body.email })
      .fetch();

    if (!user) {
      return next(createError(404, `No user found with email: ${req.body.email}`));
    } else {
      const passwordsMatch = await user.comparePassword(req.body.password);
      if (passwordsMatch) {
        const token = jwt.sign({ id: user.get('id') }, JWT_SECRET, { expiresIn: '1 day' });

        res.json({ token });
        return next()
      } else {
        return next(createError(401, 'Invalid email/password combination.'));
      }
    }
  } catch (error) {
    return next(createError(401, 'Unable to log this user in.'));
  }
});

module.exports = router;
