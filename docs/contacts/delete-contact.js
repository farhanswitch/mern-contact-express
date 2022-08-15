module.exports = {
  delete: {
    tags: ["Contacts"],
    description: "Delete spesicific contact by id",
    operationId: "deleteContactById",
    parameters: [
      {
        name: "id",
        in: "path",
        schema: {
          id: {
            type: "string",
            description: "contact's id",
            example: "01837297uiue9287u",
          },
        },
        required: true,
        description: "contact's id",
      },
    ],
    responses: {
      200: {
        description: "contact is deleted",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/contact",
            },
          },
        },
      },
      404: {
        description: "contact is not found",
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