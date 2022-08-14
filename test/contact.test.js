const { JsonWebTokenError } = require("jsonwebtoken");
const { addUser } = require("../controllers/userController");
const request = require("supertest");
// const app = require("../app");

const user = {
  name: "aa",
  email: "aa1@aa.com",
  phone: "085718033792",
};

const token = {
  INVALID:
    "fstoken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZjFjMTlhOTE5ODQ2YjZhZTMzODdmMSIsInJvbGUiOjEsImlhdCI6MTY2MDQxNjAxOSwiZXhwIjoxNjYwNTg4ODE5fQ.C9c5Jh9p11kHXm6Njyhq5w7dBMn8aSkHowFzWEZl7XN",
  VALID:
    "fstoken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZjFjMTlhOTE5ODQ2YjZhZTMzODdmMSIsInJvbGUiOjEsImlhdCI6MTY2MDQxNjAxOSwiZXhwIjoxNjYwNTg4ODE5fQ.C9c5Jh9p11kHXm6Njyhq5w7dBMn8aSkHowFzWEZl7XM",
};

jest.setTimeout(10000);
describe("test contact routes", () => {
  it("get /contacts with cookie", () => {
    request("http://localhost:4000")
      .get("/contacts")
      .set("Cookie", [token.VALID])
      .end((err, res) => {
        if (err) throw err;
        expect(res.status).toBe(200);
        expect(res.body.msg).toBe("ok");
        expect(res.body.contacts).toBeTruthy();
      });
  });
  it("get /contacts without token", () => {
    request("http://localhost:4000")
      .get("/contacts")
      .end((err, res) => {
        expect(res.status).toBe(401);
      });
  });
  it("get /contacts with invalid token", () => {
    request("http://localhost:4000")
      .get("/contacts")
      .set("Cookie", [token.INVALID])
      .end((err, res) => {
        expect(res.status).toBe(403);
      });
  });
  it("post /contacts expect error", () => {
    request("http://localhost:4000")
      .post("/contacts/add")
      .set("Cookie", [token.VALID])
      .send(user)
      .end((err, res) => {
        expect(res.status).toBe(400);
        expect(res.body.statusMsg).toBe("Error");
        expect(res.body.errors).toBeTruthy();
      });
  });
});
