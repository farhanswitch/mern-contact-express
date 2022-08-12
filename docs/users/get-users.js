module.exports = {
  get: {
    tags: ["Users"],
    description: "Get all users",
    operationId: "getAllUser",
    parameter: [],
    responses: {
      200: {
        description: "users were obtained",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/user",
            },
          },
        },
      },
    },
  },
};
