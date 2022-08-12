module.exports = {
  patch: {
    tags: ["Users"],
    description: "edit new user",
    operationId: "editUser",
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
