const request = require("supertest");

const { token } = require("./utilities");

const endpoint = "http://localhost:4000/contacts";

const newContacts = {
  _id: "62fb38bcdb720f9b12006f4d",
  name: "testing",
  email: "testing@testing.com",
  phone: "087711112222",
};

describe("Test PATCH /contacts/edit", () => {
  it("PATCH /contacts/edit without token", () => {
    request(endpoint)
      .patch("/edit")
      .send(newContacts)
      .end((err, res) => {
        expect(res.body.statusMsg).toBe("Error");
        expect(res.body.errors[0].msg).toBe(
          "You have no access id. Please Login"
        );
      });
  });
  it("PATCH /contacts/edit with INVALID token", () => {
    request(endpoint)
      .patch("/edit")
      .set("Cookie", [`fstoken=${token.INVALID}`])
      .send(newContacts)
      .end((err, res) => {
        expect(res.body.statusMsg).toBe("Error");
        expect(res.body.errors[0].msg).toBe("Invalid access id");
      });
  });
  it("PATCH /contacts/edit with VALID token role 3", () => {
    request(endpoint)
      .patch("/edit")
      .set("Cookie", [`fstoken=${token.VALID3}`])
      .send(newContacts)
      .end((err, res) => {
        expect(res.body.statusMsg).toBe("Error");
        expect(res.body.errors[0].msg).toBe("Forbidden");
      });
  });
  it("PATCH /contacts/edit with VALID token but forget to send contact data", () => {
    request(endpoint)
      .patch("/edit")
      .set("Cookie", [`fstoken=${token.VALID}`])
      .end((err, res) => {
        expect(res.body.statusMsg).toBe("Error");
        expect(res.body.errors[0].msg).toBe("uncomplete data");
      });
  });
  it("PATCH /contacts/edit with VALID token but duplicate email", () => {
    request(endpoint)
      .patch("/edit")
      .set("Cookie", [`fstoken=${token.VALID}`])
      .send({ ...newContacts, email: "angga@abc.com" })
      .end((err, res) => {
        expect(res.body.statusMsg).toBe("Error");
        expect(res.body.errors[0].msg).toBe("Duplicate email");
      });
  });
  it("PATCH /contacts/edit with VALID token but invalid email", () => {
    request(endpoint)
      .patch("/edit")
      .set("Cookie", [`fstoken=${token.VALID}`])
      .send({ ...newContacts, email: "angga@abc" })
      .end((err, res) => {
        expect(res.body.statusMsg).toBe("Error");
        expect(res.body.errors[0].msg).toBe("Email is not valid");
      });
  });
  it("PATCH /contacts/edit with VALID token but duplicate name", () => {
    request(endpoint)
      .patch("/edit")
      .set("Cookie", [`fstoken=${token.VALID}`])
      .send({ ...newContacts, name: "Angga" })
      .end((err, res) => {
        expect(res.body.statusMsg).toBe("Error");
        expect(res.body.errors[0].msg).toBe("Duplicate name");
      });
  });
  it("PATCH /contacts/edit with VALID token but invalid name", () => {
    request(endpoint)
      .patch("/edit")
      .set("Cookie", [`fstoken=${token.VALID}`])
      .send({ ...newContacts, name: "Angga23" })
      .end((err, res) => {
        expect(res.body.statusMsg).toBe("Error");
        expect(res.body.errors[0].msg).toBe(
          "Name only contain letters and spaces"
        );
      });
  });
  it("PATCH /contacts/edit with VALID token but duplicate phone", () => {
    request(endpoint)
      .patch("/edit")
      .set("Cookie", [`fstoken=${token.VALID}`])
      .send({ ...newContacts, phone: "0857180337922" })
      .end((err, res) => {
        expect(res.body.statusMsg).toBe("Error");
        expect(res.body.errors[0].msg).toBe("Duplicate phone");
      });
  });
  it("PATCH /contacts/edit with VALID token but invalid phone", () => {
    request(endpoint)
      .patch("/edit")
      .set("Cookie", [`fstoken=${token.VALID}`])
      .send({ ...newContacts, phone: "021000" })
      .end((err, res) => {
        expect(res.body.statusMsg).toBe("Error");
        expect(res.body.errors[0].msg).toBe("Phone is not valid");
      });
  });
  it("PATCH /contacts/edit with VALID token data still the same ", () => {
    request(endpoint)
      .patch("/edit")
      .set("Cookie", [`fstoken=${token.VALID}`])
      .send({ ...newContacts })
      .end((err, res) => {
        expect(res.body.statusMsg).toBe("Nothing changed");
        expect(res.body.msg).toBe("Contact is exists");
      });
  });
  //   it("PATCH /contacts/edit with VALID token SUCCESS ", () => {
  //     request(endpoint)
  //       .patch("/edit")
  //       .set("Cookie", [`fstoken=${token.VALID}`])
  //       .send({ ...newContacts })
  //       .end((err, res) => {
  //         expect(res.body.statusMsg).toBe("Success");
  //         expect(res.body.msg).toBe("Contact has been edited");
  //       });
  //   });
});
