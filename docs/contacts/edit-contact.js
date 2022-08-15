module.exports = {
  patch: {
    tags: ["Contacts"],
    description: "edit contact",
    operationId: "editContact",
    parameters: [],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/contact",
          },
        },
      },
    },
  },
};
