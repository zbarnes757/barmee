import * as commonPassword from "common-password";
import { Request, Response, Router } from "express";
import * as jwt from "jsonwebtoken";

import { IModel } from "../models/model";

const JWT_SECRET = process.env.JWT_SECRET || "kitty-kats";

export class SessionRoute {
  /**
   * Create the routes
   *
   * @class SessionRoute
   * @method create
   * @static
   */
  public static create(router: Router, { user }: IModel) {
    router.post("/api/v1/sessions/signup", async (req: Request, res: Response): Promise<any> => {
      if (commonPassword(req.body.password)) {
        res.status(400).send("Cannot use commonly used password.");
      } else {
        try {
          const u = new user({ email: req.body.email, password: req.body.password });
          await u.save();
          const token = jwt.sign({ id: u.id }, JWT_SECRET, { expiresIn: "1 day" });

          res.status(201);
          res.json({ token });
        } catch (error) {
          res.status(400).send("Please provide valid params for user creation.");
        }
      }
    });

    router.post("/api/v1/sessions/login", async (req: Request, res: Response): Promise<any> => {
      try {
        const u = await user.findOne({ email: req.body.email });

        if (!u) {
          res.status(404).send(`No user found with email: ${req.body.email}`);
        } else {
          const passwordsMatch = await u.comparePassword(req.body.password);
          if (passwordsMatch) {
            const token = jwt.sign({ id: u.id }, JWT_SECRET, { expiresIn: "1 day" });

            res.json({ token });
          } else {
            res.status(401).send("Invalid email/password combination.");
          }
        }
      } catch (error) {
        res.status(401).send("Unable to log this user in.");
      }
    });
  }
}
