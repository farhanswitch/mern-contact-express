const request = require("supertest");

const { token } = require("./utilities");

const endpoint = "http://localhost:4000/contacts";

const newContacts = {
  name: "testing",
  email: "testing@testing.com",
  phone: "087711112222",
};
describe("Test POST /contacts", () => {
  it("POST /contacts/add without token", () => {
    request(endpoint)
      .post("/add")
      .end((err, res) => {
        expect(res.body.statusMsg).toBe("Error");
        expect(res.body.errors[0].msg).toBe(
          "You have no access id. Please Login"
        );
      });
  });
  it("POST /contacts/add with INVALID token", () => {
    request(endpoint)
      .post("/add")
      .set("Cookie", [`fstoken=${token.INVALID}`])
      .end((err, res) => {
        expect(res.body.statusMsg).toBe("Error");
        expect(res.body.errors[0].msg).toBe("Invalid access id");
      });
  });
  it("POST /contacts/add invalid email", () => {
    request(endpoint)
      .post("/add")
      .set("Cookie", [`fstoken=${token.VALID}`])
      .send({ ...newContacts, email: "testing@testing" })
      .end((err, res) => {
        expect(res.body.statusMsg).toBe("Error");
        expect(res.body.errors).toBeTruthy();
        expect(res.body.errors[0].msg).toBe("Email is not valid");
      });
  });
  it("POST /contacts/add duplicate phone", () => {
    request(endpoint)
      .post("/add")
      .set("Cookie", [`fstoken=${token.VALID}`])
      .send({ ...newContacts, phone: "0857180337922" })
      .end((err, res) => {
        expect(res.body.statusMsg).toBe("Error");
        expect(res.body.errors).toBeTruthy();
        expect(res.body.errors[0].msg).toBe("Duplicate phone");
      });
  });
  it("POST /contacts/add without send new contact", () => {
    request(endpoint)
      .post("/add")
      .set("Cookie", [`fstoken=${token.VALID}`])

      .end((err, res) => {
        expect(res.body.statusMsg).toBe("Error");
        expect(res.body.errors[0].msg).toBe("uncomplete data");
      });
  });
  it("POST /contacts/add add new contact", () => {
    request(endpoint)
      .post("/add")
      .set("Cookie", [`fstoken=${token.VALID}`])
      .send({ ...newContacts })
      .end((err, res) => {
        expect(res.body.statusMsg).toBe("Success");
        expect(res.body.msg).toBe("New contact has been added");
      });
  });
});
