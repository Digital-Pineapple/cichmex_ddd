const services: any = {
    "/services": {
      get: {
        tags: ["Services"],
        description: "Todos los servicios",
        summary: "Todos los servicios",
        parameters: [],
        responses: {
          "200": {
            description: "",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Services",
                  },
                },
              },
            },
          },
          "500": {
            description: "Hubo un error al consultar la información",
          },
        },
      },
      post: {
        tags: ["Services"],
        description: "Crear un nuevo servicio",
        summary: "Crear un nuevo servicio",
        requestBody: {
            required: true,
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                name: { type: "string", example: "Nombre" },
                                description:{ type: "string", example: "Descripción"},
                                subCategory:{ type: "string"}
                            }
                        }
                    }
                }
            },
        },
        responses: {
          "200": {
            description: "Se creó con éxito",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Services",
                },
              },
            },
          },
          "500": {
            description: "Hubo un error al crear",
          },
        },
      },
    },
    "/services/{id}": {
      get: {
        tags: ["Services"],
        description: "Obtener un servicio por id",
        summary: "obtener un nuevo servicio por id",
        parameters: [{
          description: "id del servicio",
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        }],
        responses: {
          "200": {
            description: "",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Services",
                },
              },
            },
          },
          "500": {
            description: "Hubo un error al consultar la información",
          },
        },
      },
      post: {
        tags: ["Services"],
        description: "Editar servicio por id",
        summary: "Editar el servicio por id",
        parameters: [{
          description: "id del servicio",
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        }],
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            name: { type: "string", example: "Encerado" },
                            description: { type: "string", example: "Encerado completo" },
                            subCategory: { type: "string", example: "subcategory _id" },
                        },
                    },
                },
            },
        },
        responses: {
          "201": {
            description: "Elservicio se actualizó con éxito",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Servicios",
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Services"],
        description: "Eliminar servicio",
        summary: "Eliminar servicio",
        parameters: [{
          description: "id del servicio",
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        }],
        responses: {
          "201": {
            description: "El servicio se elimino con exito",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/Services" }, // Toma la referencia del modelo Category
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
    
  };
  
  export { services };
  