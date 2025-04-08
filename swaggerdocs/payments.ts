import { request } from "express";
import { get } from "mongoose";

const payments = {
  "payments": {
    get: {
      tags: ["Payments"],
      description: "get all payments",
      responses: {
        "200": {
          description: "Lista de pagos",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  $ref: "#/components/schemas/Payment",
                },
              },
            }
          }
        },
        "500": {
          description: "Internal Server Error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Hubo un error al consultar la informacion"
                  }
                }
              }
            }
          }
        }
      }
    },
  },
  "/payments/{id}": {
    get: {
      tags: ["Payments"],
      description: "get payment by id",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
          description: "id del pago",
        },
      ],
      responses: {
        "200": {
          description: "",
          content: {
            "application/json": {
              schema: {
                type: "object",
                $ref: "#/components/schemas/Payment",
              },
            },
          },
        },
        "404": {
          description: "Pago no encontrado",
        },
      },
    },
    delete:{
      tags: ["Payments"],
      description: "delete payment by id",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
          description: "id del pago",
        },
      ],
      responses: {
        "200": {
          description: "Pago eliminado correctamente",
        },
        "404": {
          description: "Pago no encontrado",
        },
      }
    }
  },
  "/payments/expired/sales": {
    get: {
      tags: ["Payments"],
      description: "limpiar pagos expirados",

      responses: {
        "200": {
          description: "notificationerificación completa",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  $ref: "#/components/schemas/Payment",
                },
              },
            }
          }
        },
        "500": {
          description: "Internal Server Error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Hubo un error al consultar la informacion"
                  }
                }
              }
            }
          }
        }
      }
    },
  },
  "/payments/addTicket": {
    post: {
      tags: ["Payments"],
      description: "upload the ticket payment",
      parameters: [
        {
          name: "id",
          in: "body",
          required: true,
          schema: {
            type: "string",
          },
          description: "id de la orden",
        },
        {
          name: "reference",
          in: "body",
          required: true,
          schema: {
            type: "string",
          },
          description: "referencia del ticket de compra",
        },
        {
          name: "amount",
          in: "body",
          required: true,
          schema: {
            type: "number",
          },
          description: "cantidad del ticket de compra",
        },
        {
          name: "ticket_image",
          in: "body",
          required: true,
          schema: {
            type: "string",
          },
          description: "imagen del ticket de compra",
        }
      ],
    },
  },
  "/payments/rejectTicket": {
    post: {
      tags: ["Payments"],
      description: "reject the ticket payment",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                },
                createdAt: {
                  type: "string",
                  format: "date-time",
                },
                notes: {
                  type: "string",
                }
              }
            }
          }
        }
      },
      responses: {
        "201": {
          description: "Ticket rechazado ",
        },
        "500": {
          description: "Hubo un error",
        },
      }
    },
  },
  "/payments/createPreferenceMP": {
    post: {
      tags: ["Payments"],
      description: "crea una preferencia de Mercado Pago",
      parameters: [
        {
          name: "total",
          in: "body",
          required: true,
          description: "total de compra"
        },
        {
          name: "subtotal",
          in: "body",
          required: true,
          description: "subtotal de compra"
        },
        {
          name: "type_delivery",
          in: "body",
          required: true,
          description: "el valor puede ser 'homedelivery' o 'pickup'"
        },
        {
          name: "shipping_cost",
          in: "body",
          required: false,
          description: "costo de envio"
        },
        {
          name: "user_id",
          in: "body",
          required: true,
          description: "id de usuario"
        },
        {
          name: "products",
          in: "body",
          required: true,
          description: "items de mercado pago"
        },
        {
          name: "redirect_urls",
          in: "body",
          required: true,
          description: "back urls mercado pago"
        },
        {
          name: "address_id",
          in: "body",
          required: false,
          description: "id de la direccion de usuario (requerido si es homedelivery)"
        },
        {
          name: "branch_id",
          in: "body",
          required: false,
          description: "id de sucursal (requerido si es pickup)"
        },
        {
          name: "X-Origin",
          in: "headers",
          required: true,
          description: "origen de la peticion 'web' o 'mobile' (se setea en los headers de la peticion)"
        },
        {
          name: "cart",
          in: "body",
          required: true,
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                item: { type: "string" },
                variant: { type: "string", required: false },
                quantity: { type: "number" },
              },
            },
          },
          description: "productos del carrito",
        },
        {
          name: "discount",
          in: "body",
          required: false,
          description: "cantidad de descuento aplicado"
        },
        {
          name: "coupon_id",
          in: "body",
          required: false,
          description: "id del cupon aplicado"
        }
      ],
      "responses": {
        "201": {
          "description": "Pago creado exitosamente",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "string",
                    "example": "euyriuerirye"
                  },
                  "init_point": {
                    "type": "string",
                    "example": "gfsfffdgdfhgjdfgjh"
                  }
                }
              }
            }
          }
        }
      }

    },
  },
  "/payments/Membership-Pay": {
    post: {
      tags: ["Payments"],
      description: "cichmex, create Mercado Pago payment for membership",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                user: {
                  type: "string",
                },
                membership: {
                  type: "string",
                },
                values: {
                  type: "object",
                  properties: {
                    token: {
                      type: "string",
                    },
                    isuuer_id: {
                      type: "string",
                    },
                    installments: {
                      type: "number",
                    },
                    notification_url: {
                      type: "string",
                    },
                    external_reference: {
                      type: "string",
                    },

                  }
                }
              }
            }
          }
        }
      },
      responses: {
        "201": {
          description: "Se pago correctamente",
        },
        "500": {
          description: "Error al crear el pago",
        },
      }
    },
  },
  "/payments/Products-Pay": {
    post: {
      tags: ["Payments"],
      description: "cichmex, create Mercado Pago payment",
      parameters: [
        {
          name: "branch_id",
          in: "body",
          required: false,
          schema: {
            type: "string",
          },
          description: "El id de la sucursal si se recoge en punto de entrega",
        },
        {
          name: "infoPayment",
          in: "body",
          required: true,
          schema: {
            type: "object",
          },
          description:
            "informacion generada del lado del cliente por Mercado Pago",
        },
        {
          name: "typeDelivery",
          in: "body",
          required: true,
          schema: {
            type: "string",
          },
          description: "tipo de envio: [homedelivery, pickup]",
        },
        {
          name: "productsOrder",
          in: "body",
          required: true,
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                item: { type: "string" },
                variant: { type: "string", required: false },
                quantity: { type: "number" },
              },
            },
          },
          description: "productos del carrito",
        },
        {
          name: "subtotal",
          in: "body",
          required: true,
          schema: {
            type: "number",
          },
          description: "subtotal de la compra",
        },
        {
          name: "shipping_cost",
          in: "body",
          required: false,
          schema: {
            type: "number",
          },
          description: "coste de envio de la compra",
        },
        {
          name: "discount",
          in: "body",
          required: false,
          schema: {
            type: "number",
          },
          description: "descuento de la compra",
        },
        {
          name: "location",
          in: "body",
          required: false,
          schema: {
            $ref: "#/components/schemas/AddressEntity",
          },
          description: "direccion del usuario para envio a domicilio",
        },
        {
          name: "X-Origin",
          in: "headers",
          required: true,
          schema: {
            type: "string",
          },
          description: "direccion de origen [web, mobile]",
        },
      ],
    },
  },
  "/payments/transfer-payment": {
    post: {
      tags: ["Payments"],
      description: "cichmex, create transfer payment",
      parameters: [
        {
          name: "branch_id",
          in: "body",
          required: false,
          schema: {
            type: "string",
          },
          description: "El id de la sucursal si se recoge en punto de entrega",
        },
        {
          name: "productsOrder",
          in: "body",
          required: true,
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                item: { type: "string" },
                variant: { type: "string", required: false },
                quantity: { type: "number" },
              },
            },
          },
          description: "productos del carrito",
        },
        {
          name: "total",
          in: "body",
          required: true,
          schema: {
            type: "number",
          },
          description: "total de la compra",
        },
        {
          name: "subTotal",
          in: "body",
          required: true,
          schema: {
            type: "number",
          },
          description: "subtotal de la compra",
        },
        {
          name: "shipping_cost",
          in: "body",
          required: false,
          schema: {
            type: "number",
          },
          description: "coste de envio de la compra",
        },
        {
          name: "discount",
          in: "body",
          required: false,
          schema: {
            type: "number",
          },
          description: "descuento de la compra",
        },
        {
          name: "location",
          in: "body",
          required: false,
          schema: {
            $ref: "#/components/schemas/AddressEntity",
          },
          description: "direccion del usuario para envio a domicilio",
        },
        {
          name: "typeDelivery",
          in: "body",
          required: true,
          schema: {
            type: "string",
          },
          description: "tipo de envio: [homedelivery, pickup]",
        },
        {
          name: "X-Origin",
          in: "headers",
          required: true,
          schema: {
            type: "string",
          },
          description: "direccion de origen [web, mobile]",
        },
      ],
    },
  },
  "/payments/success": {
    post:{
      tags: ["Payments"],
      description: "cichmex, create Mercado Pago payment",
      parameters: [
        {
          name: "infoPayment",
          in: "body",
          required: true,
          schema: {
            type: "object",
          },
          description:
            "informacion generada del lado del cliente por Mercado Pago",
        },
      ],
      responses: {
        "201": {
          description: "Pago creado exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                $ref: "#/components/schemas/Payment",
              },
            },
          },
        },
        "500": {  
          description: "Error al crear el pago",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Hubo un error al consultar la informacion"
                  }
                }
              }
            }
          }
        }
      }

    }
  },
  "/payments/Mem-Payment-success": {
    post: {
      tags: ["Payments"],
      description: "cichmex, create Mercado Pago payment",
      parameters: [
        {
          name: "infoPayment",
          in: "body",
          required: true,
          schema: {
            type: "object",
          },
          description:
            "informacion generada del lado del cliente por Mercado Pago",
        },
      ],
      responses: {
        "201": {
          description: "Pago creado exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                $ref: "#/components/schemas/Payment",
              },
            },
          },
        },
        "500": {  
          description: "Error al crear el pago",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Hubo un error al consultar la informacion"
                  }
                }
              }
            }
          }
        }
      }

    }
  },
  "/payments/validatePaymentProof": {
    post: {
      tags: ["Payments"],
      description: "cichmex, validate Mercado Pago payment",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                },
                createdAt: {
                  type: "string",
                  format: "date-time",
                },
                notes: {
                  type: "string",
                }
              }
            }
          }
        }
      },
      responses: {
        "201": {
          description: "Ticket validado correctamente",
        },
        "500": {
          description: "Hubo un error",
        },
      }
    },
  },
  "/payments/deleteTicket": {
    post: {
      tags: ["Payments"],
      description: "Eliminar ticket de pago",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                },
                createdAt: {
                  type: "string",
                  format: "date-time",
                },
              }
            }
          }
        }
      },
      responses: {
        "201": {
          description: "Ticket eliminado correctamente",
        },
        "500": {
          description: "Hubo un error",
        },
      }
    },
  },
  "/payments/UpdateTicket": {
    put: {
      tags: ["Payments"],
      description: "Actualizar ticket de pago",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                },
                createdAt: {
                  type: "string",
                  format: "date-time",
                },
                reference:{
                  type: "string",
                },
                notes: {
                  type: "string",
                }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Ticket actualizado correctamente",
        },
        "500": {
          description: "Hubo un error",
        },
      }
    },
  },







};
export { payments };
