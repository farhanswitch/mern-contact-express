const request = require("supertest");

const { token } = require("./utilities");

const endpoint = "http://localhost:4000/users";

const user = {
  id: "62f9c0762d6a57ed5f74451d",
};

describe("GET /users", () => {
  it("GET /users without token", () => {
    request(endpoint)
      .get("/")
      .end((err, res) => {
        expect(res.body.statusMsg).toBe("Error");
        expect(res.body.errors[0].msg).toBe(
          "You have no access id. Please Login"
        );
      });
  });
  it("GET /users with INVALID token", () => {
    request(endpoint)
      .get("/")
      .set("Cookie", [`fstoken=${token.INVALID}`])
      .end((err, res) => {
        expect(res.body.statusMsg).toBe("Error");
        expect(res.body.errors[0].msg).toBe("Invalid access id");
      });
  });
  it("GET /users with VALID token role 2", () => {
    request(endpoint)
      .get("/")
      .set("Cookie", [`fstoken=${token.VALID2}`])
      .end((err, res) => {
        expect(res.body.statusMsg).toBe("Error");
        expect(res.body.errors[0].msg).toBe("Forbidden");
      });
  });
  it("GET /users with VALID token role 3", () => {
    request(endpoint)
      .get("/")
      .set("Cookie", [`fstoken=${token.VALID3}`])
      .end((err, res) => {
        expect(res.body.statusMsg).toBe("Error");
        expect(res.body.errors[0].msg).toBe("Forbidden");
      });
  });
  it("GET /users with VALID token role 1", () => {
    request(endpoint)
      .get("/")
      .set("Cookie", [`fstoken=${token.VALID}`])
      .end((err, res) => {
        expect(res.body.users).toBeTruthy();
      });
  });
  it("GET /users/:id without token ", () => {
    request(endpoint)
      .get(`/${user.id}`)
      .end((err, res) => {
        expect(res.body.statusMsg).toBe("Error");
        expect(res.body.errors[0].msg).toBe(
          "You have no access id. Please Login"
        );
      });
  });
  it("GET /users/:id with INVALID token ", () => {
    request(endpoint)
      .get(`/${user.id}`)
      .set("Cookie", [`fstoken=${token.INVALID}`])
      .end((err, res) => {
        expect(res.body.statusMsg).toBe("Error");
        expect(res.body.errors[0].msg).toBe("Invalid access id");
      });
  });
  it("GET /users/:id with VALID token role 2 ", () => {
    request(endpoint)
      .get(`/${user.id}`)
      .set("Cookie", [`fstoken=${token.VALID2}`])
      .end((err, res) => {
        expect(res.body.statusMsg).toBe("Error");
        expect(res.body.errors[0].msg).toBe("Forbidden");
      });
  });
  it("GET /users/:id with VALID token role 3 ", () => {
    request(endpoint)
      .get(`/${user.id}`)
      .set("Cookie", [`fstoken=${token.VALID3}`])
      .end((err, res) => {
        expect(res.body.statusMsg).toBe("Error");
        expect(res.body.errors[0].msg).toBe("Forbidden");
      });
  });
  it("GET /users/:id with VALID token role 1 ", () => {
    request(endpoint)
      .get(`/${user.id}`)
      .set("Cookie", [`fstoken=${token.VALID}`])
      .end((err, res) => {
        expect(res.body.user).toBeTruthy();
      });
  });
  it("GET /users/:id with VALID token role 1 but invalid user id ", () => {
    request(endpoint)
      .get(`/123`)
      .set("Cookie", [`fstoken=${token.VALID}`])
      .end((err, res) => {
        expect(res.body.statusMsg).toBe("Error");
        expect(res.body.errors[0].msg).toBe("Invalid user id");
      });
  });
});
