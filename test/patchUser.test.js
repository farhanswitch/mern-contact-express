const request = require("supertest");

const { token } = require("./utilities");

const endpoint = "http://localhost:4000/users/";
const user = {
  _id: "62ecc34f589b61a1600f3762",
  name: "Syaiful Anwar",
  email: "syaiful@abc.com",
  role: 3,
};

describe("Test PATCH /users", () => {
  it("PATCH /users/edit/:id", () => {
    request(endpoint)
      .patch(`edit/${user._id}`)
      .set("Cookie", [`fstoken=${token.VALID}`])
      .send({ ...user, role: 1 })
      .end((err, res) => {
        expect(res.body.statusMsg).toBe("Success");
        expect(res.body.msg).toBe("User has been edited");
      });
  });
});
