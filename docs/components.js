module.exports = {
  components: {
    schemas: {
      user: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Name of the user",
            example: "Gazza Cahyadi",
          },
          email: {
            type: "string",
            description: "Email address of the user",
            example: "gazza@abc.com",
          },
          password: {
            type: "string",
            description: "password of the user's account",
            example: "65e67c7f7bd39e829f43962ba095fee1",
          },
          role: {
            type: "number",
            description: "authorization role of the user",
            example: 3,
          },
        },
      },
      contact: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "name of the contact",
            example: "Sheila Purnama",
          },
          email: {
            type: "string",
            description: "email address of the contact",
            example: "sheila@abc.com",
          },
          phone: {
            type: "string",
            description: "mobile phone number of the contact",
            example: "085711112222",
          },
        },
      },
      responseJSON: {
        type: "object",
        properties: {
          statusMsg: {
            type: "string",
            description: "Status of the response",
            example: "Success",
          },
          msg: {
            type: "string",
            description: "Message to the client",
            exmaple: "Contact saved successfully",
          },
        },
      },
      error: {
        type: "object",
        properties: {
          msg: {
            type: "string",
            description: "Error detail",
            example: "Email address is not valid",
          },
        },
      },
      userData: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "User id",
            example: "18jwgydg878e2ueiu1978",
          },
          role: {
            type: "number",
            description: "user's role",
            example: 2,
          },
        },
      },
      errorsUserId: {
        type: "object",
        properties: {
          statusMsg: {
            type: "string",
            example: "Error",
          },
          msg: {
            type: "string",
            example: "There is no user with that id",
          },
        },
      },
      loginUser: {
        type: "object",
        properties: {
          email: {
            type: "string",
            example: "gazza@abc.com",
          },
          password: {
            type: "string",
            example: "18yhw2y38knjoiuj",
          },
        },
      },
      logoutUser: {
        type: "object",
        properties: {
          msg: {
            type: "string",
            example: "Logged out",
          },
        },
      },
    },
  },
};
