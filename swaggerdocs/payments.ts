import { param } from "express-validator";

const payments = {
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
  "/payments/createPreferenceMP": {
    post: {
      tags: ["Payments"],
      description: "crea una preferencia de Mercado Pago",
      parameters: [        
        {
          name: "total",
          in: "body",
          required:true,
          description: "total de compra"
        },
        {
          name: "subtotal",
          in: "body",
          required:true,
          description: "subtotal de compra"
        },       
        {
          name: "type_delivery",
          in: "body",
          required:true,
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
  }
};
export { payments };
