const storeHouse = {
    "/storehouse": {
      get: {
        description: "Obtener todos los almacenes",
        tags: ["Storehouse"],
        summary: "Lista de todos los almacenes",
        responses: {
          200: {
            description: "Lista de almacenes obtenida correctamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/StoreHouse"
                      }
                    }
                  }
                }
              }
            }
          },
          500: {
            description: "Error del servidor",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Error interno al recuperar los almacenes"
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        description: "Crear un nuevo almacén",
        tags: ["Storehouse"],
        summary: "Crear almacén",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/StoreHouse"
              }
            }
          }
        },
        responses: {
          201: {  // Cambiado a 201 (Created) que es más apropiado para POST
            description: "Almacén creado exitosamente",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/StoreHouse"
                }
              }
            }
          },
          500: {
            description: "Error del servidor",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Error al crear el almacén"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/storehouse/{id}": {
      get: {
        description: "Obtener un almacén específico",
        tags: ["Storehouse"],
        summary: "Obtener almacén por ID",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "string",
              example: "a61dfwe651etrg1915",
              description: "ID del almacén"
            }
          }
        ],
        responses: {
          200: {
            description: "Almacén obtenido correctamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      $ref: "#/components/schemas/StoreHouse"
                    }
                  }
                }
              }
            }
          },
          404: {  // Agregado para cuando no se encuentra el recurso
            description: "Almacén no encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Almacén no encontrado"
                    }
                  }
                }
              }
            }
          },
          500: {
            description: "Error del servidor",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Error al obtener el almacén"
                    }
                  }
                }
              }
            }
          }
        }
      },
     delete:{
        summary: "Eliminar un almacén",
        description: "Eliminar un almacén",
        tags: ["Storehouse"],
        parameters: [
            {
                in: "path",
                name: "id",
                required: true,
                schema: {
                    type: "string"
                }
            }
        ],
        responses: {
            200: {
                description: "Almacén eliminado",
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                message: {
                                    type: "string",
                                    example: "Almacén eliminado correctamente"
                                }
                            }
                        }
                    }
                }
            }
        }

     }
    },
    "/storehouse/update/{id}": {
        put: {  // Cambiado de POST a PUT para actualización
            description: "Actualizar un almacén existente",
            tags: ["Storehouse"],
            summary: "Actualizar almacén",
            parameters: [
              {
                in: "path",
                name: "id",
                required: true,
                schema: {
                  type: "string",
                  example: "a61dfwe651etrg1915"
                }
              }
            ],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/StoreHouse"
                  }
                }
              }
            },
            responses: {
              200: {
                description: "Almacén actualizado correctamente",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/StoreHouse"
                    }
                  }
                }
              },
              404: {
                description: "Almacén no encontrado"
              },
              500: {
                description: "Error del servidor",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        message: {
                          type: "string",
                          example: "Error al actualizar el almacén"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
    }
  };
  
  export { storeHouse };