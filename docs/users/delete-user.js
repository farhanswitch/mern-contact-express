module.exports = {
  delete: {
    tags: ["Users"],
    description: "Delete spesicific user by id",
    operationId: "deleteUserById",
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
        description: "user is deleted",
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
