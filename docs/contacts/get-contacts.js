module.exports = {
  get: {
    tags: ["Contacts"],
    description: "Get all contacts",
    operationId: "getAllContact",
    parameter: [],
    responses: {
      200: {
        description: "contacts were obtained",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/contact",
            },
          },
        },
      },
    },
  },
};
