const request = require("supertest");

const { token } = require("./utilities");

const endpoint = "http://localhost:4000/contacts";

const newContact = {
  _id: "62fb38bcdb720f9b12006f4d",
  name: "testing",
  email: "testing@testing.com",
  phone: "087711112222",
};

describe("Test DELETE /contacts/delete/:id", () => {
  it("DELETE /contacts/:id without token", () => {
    request(endpoint)
      .delete(`/delete/${newContact._id}`)
      .end((err, res) => {
        expect(res.body.statusMsg).toBe("Error");
        expect(res.body.errors[0].msg).toBe(
          "You have no access id. Please Login"
        );
      });
  });
  it("DELETE /contacts/:id with INVALID token", () => {
    request(endpoint)
      .delete(`/delete/${newContact._id}`)
      .set("Cookie", [`fstoken=${token.INVALID}`])
      .end((err, res) => {
        expect(res.body.statusMsg).toBe("Error");
        expect(res.body.errors[0].msg).toBe("Invalid access id");
      });
  });
  it("DELETE /contacts/:id with INVALID token", () => {
    request(endpoint)
      .delete(`/delete/${newContact._id}`)
      .set("Cookie", [`fstoken=${token.INVALID}`])
      .end((err, res) => {
        expect(res.body.statusMsg).toBe("Error");
        expect(res.body.errors[0].msg).toBe("Invalid access id");
      });
  });
  it("DELETE /contacts/:id with VALID token role 2", () => {
    request(endpoint)
      .delete(`/delete/${newContact._id}`)
      .set("Cookie", [`fstoken=${token.VALID2}`])
      .end((err, res) => {
        expect(res.body.statusMsg).toBe("Error");
        expect(res.body.errors[0].msg).toBe("Forbidden");
      });
  });
  it("DELETE /contacts/:id with VALID token role 3", () => {
    request(endpoint)
      .delete(`/delete/${newContact._id}`)
      .set("Cookie", [`fstoken=${token.VALID3}`])
      .end((err, res) => {
        expect(res.body.statusMsg).toBe("Error");
        expect(res.body.errors[0].msg).toBe("Forbidden");
      });
  });
  it("DELETE /contacts/:id with VALID token role 1 invalid id contact", () => {
    request(endpoint)
      .delete(`/delete/123`)
      .set("Cookie", [`fstoken=${token.VALID}`])
      .end((err, res) => {
        expect(res.body.statusMsg).toBe("Error");
        expect(res.body.errors[0].msg).toBe("Invalid contact id");
      });
  });
});
