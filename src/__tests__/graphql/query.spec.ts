import * as faker from "faker";
import * as request from "supertest";
import * as jwt from "jsonwebtoken";
import { randomPolygon } from "@turf/random";
import { getCoords } from "@turf/invariant";

import Business from "../../models/business";
import User from "../../models/user";

const app = require("../../app");
const dbReset = require("../../db_reset");

const JWT_SECRET = process.env.JWT_SECRET || "kitty-kats";

let user,
    token;

beforeEach(() => {
  return dbReset()
    .then(() => User
        .forge({
          email: faker.internet.email(),
          password: faker.random.word(),
        })
        .save())
    .then((u) => {
      user = u;
      token = jwt.sign({ id: user.get("id") }, JWT_SECRET, { expiresIn: "1 day" });
    });
});

describe("currentUser query", () => {
  test("should return information for the currently signed in user", async () => {
    const query = {
      query: `
        query {
          currentUser {
            id
            email
          }
        }
      `,
    };

    const { body } = await request(app)
      .post("/graphql")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(query)
      .expect(200);

    expect(body.data.currentUser.id).toBe(user.get("id"));
    expect(body.data.currentUser.email).toBe(user.get("email"));
  });
});

describe("Business query", () => {
  test("should return a business by id", async () => {
    const business = await Business
      .forge({
        name: faker.random.word(),
        address_1: faker.random.word(),
        address_2: faker.random.word(),
        city: faker.random.word(),
        state: faker.random.word(),
        zip: faker.random.word(),
        country: faker.random.word(),
      })
      .save();

    const query = {
      query: `
        query {
          business(id: "${business.get("id")}") {
            name
          }
        }
      `,
    };

    const { body } = await request(app)
      .post("/graphql")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(query)
      .expect(200);

    expect(body.data.business.name).toBe(business.get("name"));
  });

  test.only("should render GeoJson", async () => {
    const poly = randomPolygon().features[0];

    const boundary = {
      type: "Polygon",
      coordinates: getCoords(poly),
    };

    const business = await Business
      .forge({
        name: faker.random.word(),
        address_1: faker.random.word(),
        address_2: faker.random.word(),
        city: faker.random.word(),
        state: faker.random.word(),
        zip: faker.random.word(),
        country: faker.random.word(),
        boundary,
      })
      .save();

    const query = {
      query: `
        query {
          business(id: "${business.get("id")}") {
            boundary
          }
        }
      `,
    };

    const { body } = await request(app)
      .post("/graphql")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(query)
      .expect(200);

    console.log(body);
    // expect(body.data.business.name).toBe(business.get('name'));
  });
});
