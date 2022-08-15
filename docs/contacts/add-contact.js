module.exports = {
  post: {
    tags: ["Contacts"],
    description: "add new contact",
    operationId: "addContact",
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
