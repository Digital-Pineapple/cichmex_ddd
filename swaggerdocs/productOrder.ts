
const productOrder = {
    "/product-order/optimation_to_delivery": {
        get: {
            tags: ["Product Order"],
            summary: "Lista de paquetes optimizados para entrega",
            description: "Get optimized packages to delivery",
            "parameters": [
                {
                    "name": "coords",
                    "in": "query",
                    "required": true,
                    "description": "Coordenadas del usuario",
                    "schema": {
                        type: "object",
                        properties: {
                            coords: {
                                type: 'object',
                                properties: {
                                    lat: { type: 'string' },
                                    lgt: { type: 'string' }
                                }
                            }
                        }
                    }
                },

            ],
            responses: {
                201: {
                    description: "Region created",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Region"
                            }
                        }
                    }
                },
                400: {
                    description: "Invalid input"
                }
            }
        }
    },
    "/product-order/pending-transfer": {
        get: {
            tags: ["Product Order"],
            summary: "Pedidos pendientes de enviar a punto de entrega",
            description: "Pedidos pendientes de enviar a punto de entrega",
            responses: {
                200: {
                    description: "Lista de paquetes",
                    content: {
                        "application/json": {
                            schema: {
                                type: "array",
                                items: {
                                    $ref: "#/components/schemas/ProductOrder"
                                },
                            }
                        }
                    }
                }
            }
        }
    },
    "/product-order/ready_to_delivery": {
        get: {
            tags: ["Product Order"],
            summary: "Pedidos listos para entregar",
            description: "Pedidos listos para entregar",
            responses: {
                200: {
                    description: "Lista de paquetes",
                    content: {
                        "application/json": {
                            schema: {
                                type: "array",
                                items: {
                                    $ref: "#/components/schemas/ProductOrder"
                                },
                            }
                        }
                    }
                }
            }
        }
    },
    "/product-order/-paid/all": {
        get: {
            tags: ["Product Order"],
            summary: "Pedidos pagados",
            description: "Pedidos pagados",
            responses: {
                200: {
                    description: "Lista de paquetes",
                    content: {
                        "application/json": {
                            schema: {
                                type: "array",
                                items: {
                                    $ref: "#/components/schemas/ProductOrder"
                                },
                            }
                        }
                    }
                }
            }
        }
    },
    "/product-order": {
        get: {
            tags: ["Product Order"],
            summary: "Todos los pedidos",
            description: "Todos los pedidos",
            responses: {
                200: {
                    description: "Lista de paquetes",
                    content: {
                        "application/json": {
                            type: "object",
                            properties: {
                                data: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/ProductOrder"
                                    },
                                },
                                message: ''
                            }

                        },
                    }
                },
                "500": {
                    description: "Error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "Hubo un error al consultar la información" },
                                },
                            },
                        },
                    },
                },
            }
        },

    },
    "/product-order/{id}": {
        get: {
            tags: ["Product Order"],
            summary: "Obtener un pedido por id",
            description: "Obtener un pedido por id",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string"
                    },
                    description: "ID del pedido"
                }
            ],
            responses: {
                200: {
                    description: "Pedido obtenido correctamente",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/ProductOrder"
                                    },
                                    message: {
                                        type: "string",
                                        example: "Pedido encontrado correctamente"
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "Hubo un error al consultar la información"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        delete: {
            tags: ["Product Order"],
            summary: "Eliminar un venta",
            description: "Esta ruta permite eliminar venta enviando el id.",
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
                    description: "Eliminado exitosamente",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "Banner eliminado con éxito" },
                                    data: {
                                       $ref: "#/components/schemas/ProductOrder",
                                }
                            }
                        }
                    }
                },
                "500": {
                    description: "Error en la eliminación",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "Hubo un error al eliminar" }
                                }
                            }
                        }
                    }
                },
            }
        }
    }
    },
    "/product-order/AssignedPO/user": {
        get: {
            tags: ["Product Order"],
            summary: "Obtener pedidos asignados a usuario",
            description: "Obtener pedidos asignados a usuario ",
            responses: {
                200: {
                    description: "",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/ProductOrder"
                                        }
                                    },
                                    message: {
                                        type: "string",
                                        example: ""
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "Hubo un error al consultar la información"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/product-order/deliveries": {
        get: {
            tags: ["Product Order"],
            summary: "Obtener pedidos entregados",
            description: "Obtener pedidos entregados",
            responses: {
                200: {
                    description: "",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/ProductOrder"
                                        }
                                    },
                                    message: {
                                        type: "string",
                                        example: ""
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "Hubo un error al consultar la información"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/product-order/paidAndFill/find": {
        get: {
            tags: ["Product Order"],
            summary: "Obtener pedidos pagados y surtidos",
            description: "Obtener pedidos pagados y surtidos",
            responses: {
                200: {
                    description: "",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/ProductOrder"
                                        }
                                    },
                                    message: {
                                        type: "string",
                                        example: ""
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "Hubo un error al consultar la información"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/product-order/paidAndSupplyToPoint": {
        get: {
            tags: ["Product Order"],
            summary: "Obtener pedidos pagados y surtidos listos para enviar a punto de entrega ",
            description: "Obtener pedidos pagados y surtidos listos para enviar a punto de entrega",
            responses: {
                200: {
                    description: "",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/ProductOrder"
                                        }
                                    },
                                    message: {
                                        type: "string",
                                        example: ""
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "Hubo un error al consultar la información"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/product-order/paidAndSupply": {
        get: {
            tags: ["Product Order"],
            summary: "Obtener pedidos pagados y surtidos listos para enviar",
            description: "Obtener pedidos pagados y surtidos listos para enviar",
            responses: {
                200: {
                    description: "",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/ProductOrder"
                                        }
                                    },
                                    message: {
                                        type: "string",
                                        example: ""
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "Hubo un error al consultar la información"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/product-order/resume": {
        get: {
            tags: ["Product Order"],
            summary: "Obtener resumen de ventas",
            description: "Obtener resumen de ventas",
            responses: {
                200: {
                    description: "",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/ProductOrder"
                                        }
                                    },
                                    message: {
                                        type: "string",
                                        example: ""
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "Hubo un error al consultar la información"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/product-order/{id}/pdf": {
        get: {
            tags: ["Product Order"],
            summary: "Descargar pedido en formato PDF",
            description: "Genera y devuelve un archivo PDF del pedido",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string"
                    },
                    description: "ID del pedido"
                }
            ],
            responses: {
                200: {
                    description: "Archivo PDF del pedido",
                    content: {
                        "application/pdf": {
                            schema: {
                                type: "string",
                                format: "binary"
                            }
                        }
                    }
                },
                404: {
                    description: "Pedido no encontrado"
                },
                500: {
                    description: "Error al generar el PDF"
                }
            }
        }
    },
    "/product-order/autoAssignOrders/region": {
        get: {
            tags: ["Product Order"],
            summary: "Auto asignar pedidos a transportistas por región",
            description: "Auto asignar pedidos a transportistas por región",
            responses: {
                200: {
                    description: "",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/ProductOrder"
                                        }
                                    },
                                    message: {
                                        type: "string",
                                        example: ""
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "Hubo un error al consultar la información"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/product-order/readyToPoint/ok": {
        get: {
            tags: ["Product Order"],
            summary: "Pedidos listos para entregar a punto de entrega",
            description: "Pedidos listos para entregar a punto de entrega",
            responses: {
                200: {
                    description: "",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/ProductOrder"
                                        }
                                    },
                                    message: {
                                        type: "string",
                                        example: ""
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "Hubo un error al consultar la información"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/product-order/verifyPackage/{id}": {
        get: {
            tags: ["Product Order"],
            summary: "Verificar carga de paquete",
            description: "Verificar carga de paquete",
            responses: {
                200: {
                    description: "",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/ProductOrder"
                                        }
                                    },
                                    message: {
                                        type: "string",
                                        example: ""
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "Hubo un error al consultar la información"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/product-order/optimation/RouteDelivery": {
        get: {
            tags: ["Product Order"],
            summary: "Ver ruta optimizada de envios",
            description: "Ver ruta optimizada de envios",
            responses: {
                200: {
                    description: "",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/ProductOrder"
                                        }
                                    },
                                    message: {
                                        type: "string",
                                        example: ""
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "Hubo un error al consultar la información"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/product-order/outOfRegions/get": {
        get: {
            tags: ["Product Order"],
            summary: "Pedidos fuera de regiones",
            description: "Pedidos fuera de regiones",
            responses: {
                200: {
                    description: "",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/ProductOrder"
                                        }
                                    },
                                    message: {
                                        type: "string",
                                        example: ""
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "Hubo un error al consultar la información"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/product-order/ordersByBranch/{id}": {
        get: {
            tags: ["Product Order"],
            summary: "Pedidos por sucursal",
            description: "Pedidos por sucursal",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string"
                    },
                    description: "ID de la sucursal"
                }
            ],
            responses: {
                200: {
                    description: "",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/ProductOrder"
                                        }
                                    },
                                    message: {
                                        type: "string",
                                        example: ""
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "Hubo un error al consultar la información"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/product-order/delivered_by_branch/{id}": {
        get: {
            tags: ["Product Order"],
            summary: "Pedidos entregados por sucursal",
            description: "Pedidos entregados por sucursal",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string"
                    },
                    description: "ID de la sucursal"
                }
            ],
            responses: {
                200: {
                    description: "",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/ProductOrder"
                                        }
                                    },
                                    message: {
                                        type: "string",
                                        example: ""
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "Hubo un error al consultar la información"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/product-order/end-shipping": {
        post: {
            tags: ["Product Order"],
            summary: "Finalizar entrega",
            description: "Finalizar entrega",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                _id: { type: "string" },
                                notes: { type: "string" }
                            },
                            required: ["_id"]
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/ProductOrder"
                                    },
                                    message: {
                                        type: "string",
                                        example: "Se entregó con éxito"
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "Hubo un error al consultar la información"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/product-order/endShippingToPoint": {
        post: {
            tags: ["Product Order"],
            summary: "Finalizar entrega a punto de entrega",
            description: "Finalizar entrega a punto de entrega",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                _id: { type: "string" },
                                notes: { type: "string" }
                            },
                            required: ["_id"]
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Entrega finalizada correctamente",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/ProductOrder"
                                    },
                                    message: {
                                        type: "string",
                                        example: "Se entregó con éxito"
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "Hubo un error al consultar la información"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/product-order/start-verifyQr": {
        post: {
            tags: ["Product Order"],
            summary: "Verificar qr del usuario",
            description: "Verificar qr del usuario",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                order_id: { type: "string" },
                                user_id: { type: "string" },
                                v_code: { type: "string" },
                            },
                            required: ["_id"]
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Entrega finalizada correctamente",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/ProductOrder"
                                    },
                                    message: {
                                        type: "string",
                                        example: "Se entregó con éxito"
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "Hubo un error al consultar la información"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/product-order/verifyStartRoute": {
        post: {
            tags: ["Product Order"],
            summary: "Comenzar la ruta de envío de paquete",
            description: "Comenzar la ruta de envío de paquete",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                id: { type: "string" },
                                user_id: { type: "string" },

                            },
                            required: ["_id"]
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Entrega finalizada correctamente",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/ProductOrder"
                                    },
                                    message: {
                                        type: "string",
                                        example: "Se entregó con éxito"
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "Hubo un error al consultar la información"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/product-order/assignRoute": {
        post: {
            tags: ["Product Order"],
            summary: "Comenzar la ruta de envío de paquete",
            description: "Comenzar la ruta de envío de paquete",
            requestBody: {
                required: true,
                content: {
                    "multipart/form-data": {
                        schema: {
                            type: "object",
                            properties: {
                                order_id: { type: "string" },
                                user_id: { type: "string" },
                                guide: { type: "string" },
                                shipping_company: { type: "string" },
                                guide_pdf: {
                                    type: "string",
                                    format: "binary"
                                }
                            },
                            required: ["order_id", "user_id", "guide", "shipping_company"]
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Entrega finalizada correctamente",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/ProductOrder"
                                    },
                                    message: {
                                        type: "string",
                                        example: "Se entregó con éxito"
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "Hubo un error al consultar la información"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/product-order/fill-order/{id}": {
        post: {
            tags: ["Product Order"],
            summary: "Completar surtir pedido",
            description: "Completar surtir pedido",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string"
                    },
                    description: "ID del pedido"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                storeHouse: { type: "string" },
                               
                            },
                            required: ["storeHouse"]
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: "Orden surtida con éxito",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/ProductOrder"
                                    },
                                    message: {
                                        type: "string",
                                        example: "Se entregó con éxito"
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "Hubo un error al consultar la información"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/product-order/fill_one_product/{id}": {
        post: {
            tags: ["Product Order"],
            summary: "Surtir un producto",
            description: "Surtir un producto",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string"
                    },
                    description: "ID del pedido"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                product_id: { type: "string" },
                                section: {type: "string"},
                                quantiry:{ type: "number"},
                                type:{ type: "string"}
                               
                            },
                            required: ["storeHouse"]
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: "Orden surtida con éxito",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/ProductOrder"
                                    },
                                    message: {
                                        type: "string",
                                        example: "Se entregó con éxito"
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "Hubo un error al consultar la información"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/product-order/verifyQrToPoint": {
        put: {
            tags: ["Product Order"],
            summary: "Verificar qr en el punto de entrega",
            description: "Verificar qr en el punto de entrega",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                order_id: { type: "string" },
                               
                            },
                            required: ["order_id"]
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: "Orden surtida con éxito",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/ProductOrder"
                                    },
                                    message: {
                                        type: "string",
                                        example: "Se entregó con éxito"
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "Hubo un error al consultar la información"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/product-order/start_routes": {
        put: {
            tags: ["Product Order"],
            summary: "Comenzar ruta de envío",
            description: "Comenzar ruta de envío",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                routes: { type: "string" },
                               
                            },
                            required: ["routes"]
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: "Orden surtida con éxito",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/ProductOrder"
                                    },
                                    message: {
                                        type: "string",
                                        example: "Se entregó con éxito"
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "Hubo un error al consultar la información"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },







}
export { productOrder }