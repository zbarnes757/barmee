import * as faker from "faker";
import * as request from "supertest";
import { Server } from "../../app";

let app;
let server;

beforeEach(() => {
  server = Server.bootstrap();
  app = server.app;

  return server.connection.dropDatabase();
});

describe("POST /api/v1/sessions/signup", () => {
  test("should create a new user", async () => {
    const email = faker.internet.email();
    const response = await request(app)
      .post("/api/v1/sessions/signup")
      .send({
        email,
        password: faker.random.word(),
      })
      .set("Content-Type", "application/json")
      .expect(201);

    expect(response.body.token).toBeDefined();

    const user = await server.model.user.findOne({ email });
    expect(user).toBeDefined();
  });

  test("should 400 if missing values", () => request(app)
    .post("/api/v1/sessions/signup")
    .send({ password: faker.random.word() })
    .set("Content-Type", "application/json")
    .expect(400));
});

describe("POST /api/v1/sessions/login", () => {
  test("should return a token after sign in", async () => {
    const password = faker.random.word();
    const user = await server.model
      .user({
        email: faker.internet.email(),
        password,
      })
      .save();

    const response = await request(app)
      .post("/api/v1/sessions/login")
      .send({ email: user.email, password })
      .expect(200);

    expect(response.body.token).toBeDefined();
  });

  test("should 404 if user email does not exist", async () => await request(app)
    .post("/api/v1/sessions/login")
    .send({
      email: faker.internet.email(),
      password: faker.random.word(),
    })
    .expect(404));

  test("should 401 if password is incorrect", async () => {
    const user = await server.model
      .user({
        email: faker.internet.email(),
        password: faker.random.word(),
      })
      .save();

    await request(app)
      .post("/api/v1/sessions/login")
      .send({
        email: user.email,
        password: faker.random.word(),
      })
      .expect(401);
  });
});
