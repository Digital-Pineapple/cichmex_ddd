const category: any = {
  "/category": {
    get: {
      tags: ["Category"],
      description: "Return all categories",
      parameters: [],
      responses: {
        "200": {
          description: "The request was successful",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Category",
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
      tags: ["Category"],
      description: "Create a new category",
      parameters: [{
        description: "category name",
        name: "name",
        in: "body",
        required: true,
        schema: {
          type: "string",
        },
      }],
      responses: {
        "200": {
          description: "The request was successful",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Category",
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
  "/category/{id}": {
    get: {
      tags: ["Category"],
      description: "Return one category by id",
      parameters: [{
        description: "category id",
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      }],
      responses: {
        "200": {
          description: "The request was successful",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Category",
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
      tags: ["Category"],
      description: "Edit a category by id",
      parameters: [{
        description: "category id",
        name: "id",
        in: "path",      
        required: true,
        schema: {
          type: "string",
        },
      }],
      responses: {
        "200": {
          description: "The request was successful",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Category",
              },
            },
          },
        },
      },
    },
    delete: {
      tags: ["Category"],
      description: "Delete a category by id",
      parameters: [{
        description: "category id",
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      }],
      responses: {
        "200": {
          description: "The request was successful",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Category" }, // Toma la referencia del modelo Category
                  { // Sobrescribe solo el atributo status
                    type: "object",
                    properties: {
                      status: {
                        type: "boolean",
                        example: false // Sobrescribe el valor de ejemplo de status a false
                      }
                    }
                  }
                ]
              },
            },
          },
        },
      },
    }
  },
  "/category/SC":{
    get:{
      tags: ["Category"],
      description: "Return all categories with their subcategories",
      parameters: [],
      responses: {
        "200": {
          description: "The request was successful",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Category",
                },
              },
            },
          },
        },
        "500": {
          description: "Internal Server Error",
        },
      },
    }
  },  
};

export { category };
