const request = require("supertest");

const { token } = require("./utilities");
const { findContact } = require("../controllers/contactController");
const endpoint = "http://localhost:4000/contacts";

const contactMFarhan = {
  name: "Muhammad Farhan",
  email: "farhan1@abc.com",
  role: 1,
  _id: "62f4a87ed2f26cf02298300c",
};

describe("Test endpoint /contacts", () => {
  it("test GET /contacts without token", () => {
    request(endpoint)
      .get("/")
      .end((err, res) => {
        expect(res.body.statusMsg).toBe("Error");
      });
  });
  it("test GET /contacts with INVALID token", () => {
    request(endpoint)
      .get("/")
      .set("Cookie", [`fstoken=${token.INVALID}`])
      .end((err, res) => {
        expect(res.body.statusMsg).toBe("Error");
        expect(res.body.errors[0].msg).toBe("Invalid access id");
      });
  });
  it("test GET /contacts with VALID token", () => {
    request(endpoint)
      .get("/")
      .set("Cookie", [`fstoken=${token.VALID}`])
      .end((err, res) => {
        expect(res.body.contacts).toBeTruthy();
      });
  });
  it("test GET /contacts/:id, spesific contact MFarhan ", () => {
    request(endpoint)
      .get(`/${contactMFarhan._id}`)
      .set("Cookie", [`fstoken=${token.VALID}`])
      .end((err, res) => {
        expect(res.body.contact).toBeTruthy();
        expect(res.body.contact.name).toBe(contactMFarhan.name);
        expect(res.body.contact.email).toBe(contactMFarhan.email);
      });
  });
  // it("test controller findContact", async (done) => {
  //   const contact = await findContact("email", contactMFarhan.email);
  //   expect(contact).toBeTruthy();
  //   done();
  // });
});
