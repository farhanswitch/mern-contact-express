module.exports = {
  post: {
    tags: ["Users"],
    description: "add new user",
    operationId: "addUser",
    parameters: [],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/user",
          },
        },
      },
    },
  },
};
