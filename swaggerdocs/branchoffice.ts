const branchoffice = {
  "/branch-offices": {
    get: {
      tags: ["BranchOffice"],
      description: "Return all branch offices",
      parameters: [],
      responses: {
        "200": {
          description: "The request was successful",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/BranchOffice",
                },
              },
            },
          },
        },
        "500": {
          description: "Internal Server Error",
        },
      },
    },
    post: {
      tags: ["BranchOffice"],
      description: "Create a new branch office",
      parameters: [
        {
          name: "name",
          in: "body",
          required: true,
          schema: {
            type: "string",
          },
        },
        {
          name: "description",
          in: "body",
          required: true,
          schema: {
            type: "string",
          },
        },
        {
          name: "phone_number",
          in: "body",
          required: true,
          schema: {
            type: "string",
          },
        },
        {
          name: "location",
          in: "body",
          required: true,
          schema: {
            type: "object",
            properties: {
              latitude: { type: "number" },
              longitude: { type: "number" },
            },
          },
        },
        {
          name: "schedules",
          in: "body",
          required: true,
          schema: {
            type: "string",
            description: "JSON string with schedule info",
          },
        },
        {
          name: "type",
          in: "body",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        "201": {
          description: "Branch office created successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/BranchOffice",
              },
            },
          },
        },
        "500": {
          description: "Internal Server Error",
        },
      },
    },
  },
  "/branch-offices/{id}": {
    get: {
      tags: ["BranchOffice"],
      description: "Return branch office by id",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        "200": {
          description: "The request was successful",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/BranchOffice",
              },
            },
          },
        },
        "500": {
          description: "Internal Server Error",
        },
      },
    },
    patch: {
      tags: ["BranchOffice"],
      description: "Update a branch office by id",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        "200": {
          description: "Branch office updated successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/BranchOffice",
              },
            },
          },
        },
        "500": {
          description: "Internal Server Error",
        },
      },
    },
    delete: {
      tags: ["BranchOffice"],
      description: "Delete a branch office by id",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        "200": {
          description: "Branch office deleted successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/BranchOffice" },
                  {
                    // Sobrescribe solo el atributo status
                    type: "object",
                    properties: {
                      status: {
                        type: "boolean",
                        example: false, // Sobrescribe el valor de ejemplo de status a false
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        "500": {
          description: "Internal Server Error",
        },
      },
    },
  },
  "/branch-offices/user/{id}": {
    get: {
      tags: ["BranchOffice"],
      description: "Return branch offices by user id",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        "200": {
          description: "The request was successful",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/BranchOffice",
                },
              },
            },
          },
        },
        "500": {
          description: "Internal Server Error",
        },
      },
    },
  },
  "/branch-offices/verify/{id}": {
    post: {
      tags: ["BranchOffice"],
      description: "Verify a branch office by id",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        "200": {
          description: "Branch office verified successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/BranchOffice" },
                  {
                    type: "object",
                    properties: {
                      activated: {
                        type: "boolean",
                        example: true,
                      },
                    },
                  },
                ],
              }, // Add this closing brace
            },
          },
        },
        "500": {
          description: "Internal Server Error",
        },
      },
    },
  },
  "/branch-offices/desactivate/{id}": {
    post: {
      tags: ["BranchOffice"],
      description: "Desactivate a branch office by id",
      summary: "Desactivar branch office",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        "200": {
          description: "Desactivar sucursal",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/BranchOffice" },
                  {
                    type: "object",
                    properties: {
                      activated: {
                        type: "boolean",
                        example: true,
                      },
                    },
                  },
                ],
              }, // Add this closing brace
            },
          },
        },
        "500": {
          description: "Hubo un error al desactivar",
        },
      },
    },
  },
};

export { branchoffice };
