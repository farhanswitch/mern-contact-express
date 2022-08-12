module.exports = {
  post: {
    tags: ["Users"],
    description: "login user",
    operationId: "loginUser",
    parameters: [],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/loginUser",
          },
        },
      },
    },
  },
};
