module.exports = {
  get: {
    tags: ["Users"],
    description: "Get spesicific user by id",
    operationId: "getUserById",
    parameters: [
      {
        name: "id",
        in: "path",
        schema: {
          id: {
            type: "string",
            description: "user's id",
            example: "01837297uiue9287u",
          },
        },
        required: true,
        description: "user's id",
      },
    ],
    responses: {
      200: {
        description: "user is obtained",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/user",
            },
          },
        },
      },
      404: {
        description: "User is not found",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/errorsUserId",
            },
          },
        },
      },
    },
  },
};
