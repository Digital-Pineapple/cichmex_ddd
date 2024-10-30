const subcategory: any = {
  "/sub-category": {
    get: {
      tags: ["SubCategory"],
      description: "Return all subcategories",
      parameters: [],
      responses: {
        "200": {
          description: "The request was successful",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/SubCategory",
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
      tags: ["SubCategory"],
      description: "Create a new subcategory",
      parameters: [
        {
          description: "subcategory name",
          name: "name",
          in: "body",
          required: true,
          schema: {
            type: "string",
          },
        },
        {
          description: "category id",
          name: "category_id",
          in: "body",
          required: true,
          schema: {
            type: "string",
          },
        },
        {
          description: "subcategory image",
          name: "image",
          in: "body",
          required: false,
          schema: {
            type: "string",
          },
        }
      ],
      responses: {
        "200": {
          description: "The request was successful",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/SubCategory",
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
  "/sub-category/{id}": {
    get: {
      tags: ["SubCategory"],
      description: "Return one subcategory by id",
      parameters: [
        {
          description: "subcategory id",
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
                $ref: "#/components/schemas/SubCategory",
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
      tags: ["SubCategory"],
      description: "Edit a subcategory by id",
      parameters: [
        {
          description: "subcategory id",
          name: "id",
          in: "path",
          required: false,
          schema: {
            type: "string",
          },
        },
        {
          description: "subcategory name",
          name: "name",
          in: "body",
          required: false,
          schema: {
            type: "string",
          },
        },
        {
          description: "subcategory image",
          name: "image",
          in: "body",
          required: false,
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
                 $ref: "#/components/schemas/SubCategory"            
              },
            },
          },
        },
      },
    },
    delete: {
      tags: ["SubCategory"],
      description: "Delete a subcategory by id",
      parameters: [
        {
          description: "subcategory id",
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
                allOf: [
                  { $ref: "#/components/schemas/SubCategory" }, // Toma la referencia del modelo Category
                  {
                    // Sobrescribe solo el atributo status
                    type: "object",
                    properties: {
                      status: {
                        type: "boolean",
                        example: false, // Sobrescribe el valor del status a false
                      },                     
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
  },
};

export { subcategory };
