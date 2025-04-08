const servicesInBranch: any = {
    "/services-branch": {
      get: {
        tags: ["Services In Branch"],
        description: "Todos los servicios en la sucursal",
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
                    $ref: "#/components/schemas/ServicesInBranch",
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
        tags: ["Services In Branch"],
        description: "Crear un nuevo servicio en la sucursal",
        summary: "Crear un nuevo servicio en la sucursal",
        requestBody: {
            required: true,
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                service_id: { type: "string", example:"Id del servicio" },
                                typeCar_id:{ type: "string", example: "Id del auto"},
                                price:{ type: "number", example:100 },
                                desctiption:{ type:"string", exaple:"descripción"},
                                branch_id:{ type: "string", example:"id de la sucursal"}
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
    "/services-branch/{id}": {
      get: {
        tags: ["Services In Branch"],
        description: "Obtener un servicio de sucursal por id",
        summary: "obtener un nuevo servicio de sucursal por id",
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
                  $ref: "#/components/schemas/ServicesInBranch",
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
        tags: ["Services In Branch"],
        description: "Editar servicio de sucursal por id",
        summary: "Editar el servicio de sucursal por id",
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
                            service_id: { type: "string", example: "Id del servicio" },
                            typeCar_id: { type: "string", example: "Id del tipo de auto" },
                            description: { type: "string", example: "Descripción del servicio" },
                            branch_id:{ type: "string", example: "id de la sucursal"}
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
        tags: ["Services In Branch"],
        description: "Eliminar servicio en la sucursal",
        summary: "Eliminar servicio een la sucursal",
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
            description: "Eliminado correctamente",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ServicesInBranch" }, // Toma la referencia del modelo Category
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
    "/services-branch/branch/{id}": {
      get: {
        tags: ["Services In Branch"],
        description: "Obtener servicios de la sucursal",
        summary: "Obtener servicios de la sucursal",
        parameters: [{
          description: "id de la sucursal",
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
                  $ref: "#/components/schemas/ServicesInBranch",
                },
              },
            },
          },
          "404": {
            description: "Hubo un error al consultar la información",
          },
        },
      },
      
    },
    
  };
  
  export { servicesInBranch };
  