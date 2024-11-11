const address: any = {
    "/user/create/address": {
      "post": {
        "tags": ["Address"],
        "summary": "Crear una dirección",
        "description": "Crea una nueva dirección para el usuario autenticado.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
             "schema": {
              "type": "object",
              "properties": {                
                "name": { "type": "string" },
                "phone": { "type": "string" },
                "street": { "type": "string" },
                "numext": { "type": "string" },
                "numint": { "type": "string" },
                "zipcode": { "type": "string" },
                "city": { "type": "string" },
                "state": { "type": "string" },
                "municipality": { "type": "string" },
                "neighborhood": { "type": "string" },
                "reference": { "type": "string" },
                "btwstreet": { "type": "string" },
                "country": { "type": "string" },
                "status": { "type": "boolean" },
                "default": { "type": "boolean" },
                "lat": { "type": "number" },
                "lgt": { "type": "number" },              
              },
              // "required": [ "street", "zipcode", "city", "country"]
            }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Dirección creada exitosamente",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/AddressEntity"
                  }
                }
              }
            }
          },
          "400": {
            "description": "La dirección es requerida"
          },
          "500": {
            "description": "Hubo un error al crear la dirección"
          }
        }
      }
    },
    "/user/addresses/ok": {
      "get": {
        "tags": ["Address"],
        "summary": "Obtener direcciones del usuario",
        "description": "Obtiene todas las direcciones asociadas a un usuario.",
        "responses": {
          "200": {
            "description": "Lista de direcciones obtenida exitosamente",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/AddressEntity"
                  }
                }
              }
            }
          },
          "500": {
            "description": "Hubo un error al obtener las direcciones"
          }
        }
      },
    },
    "/update/address/:id":{
      "put": {
        "tags": ["Address"],
        "summary": "Actualizar una dirección",
        "description": "Actualiza la dirección especificada por el ID.",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "ID de la dirección a actualizar"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "array",
                "items": {
                  "$ref": "#/components/schemas/AddressEntity"
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Dirección actualizada exitosamente",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/AddressEntity"
                  }
                }
              }
            }
          },
          "400": {
            "description": "La dirección es requerida"
          },
          "500": {
            "description": "Hubo un error al actualizar la dirección"
          }
        }
      },
    },
    "/delete/address/:id":{
      "delete": {
        "tags": ["Address"],
        "summary": "Eliminar una dirección",
        "description": "Elimina la dirección especificada por el ID.",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "ID de la dirección a eliminar"
          }
        ],
        "responses": {
          "200": {
            "description": "Dirección eliminada exitosamente",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/AddressEntity"
                  }
                }
              }
            }
          },
          "500": {
            "description": "Hubo un error al eliminar la dirección"
          }
        }
      }

    },
  }
  
  export { address };