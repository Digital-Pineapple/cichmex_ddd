const shippingCost: any = {
    "/shipping-cost": {
        get: {
            tags: ["Shipping Cost"],
            description: "Todos los costos de envío",
            summary: "Todos los costos de envío",
            parameters: [],
            responses: {
                "200": {
                    description: "",
                    content: {
                        "application/json": {
                            schema: {
                                type: "array",
                                items: {
                                    $ref: "#/components/schemas/ShippingCost",
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
            tags: ["Shipping Cost"],
            description: "Crear un costo de envío",
            summary: "Crear un costo de envío",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/ShippingCost"
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "Se creó con éxito",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ShippingCost",
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
    "/shipping-cost/{id}": {
        get: {
            tags: ["Shipping Cost"],
            description: "Obtener un costo de envío",
            summary: "obtener un costo de envío",
            parameters: [{
                description: "id del costo de envío",
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
                                $ref: "#/components/schemas/ShippingCost",
                            },
                        },
                    },
                },
                "500": {
                    description: "Hubo un error al consultar la información",
                },
            },
        },
        put: {
            tags: ["Shipping Cost"],
            description: "Editar costo de envío",
            summary: "Editar costo de envío",
            parameters: [{
                description: "id del costo de envío",
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
                            $ref: "#/components/schemas/ShippingCost"
                        }
                    }
                }
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
            tags: ["Shipping Cost"],
            description: "Eliminar costo de envío",
            summary: "Eliminar costo de envío",
            parameters: [{
                description: "id del costo de envío",
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
                                    { $ref: "#/components/schemas/ShippingCost" }, // Toma la referencia del modelo Category
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
    "/shipping-cost/find/price": {
        get: {
            tags: ["Shipping Cost"],
            description: "Consultar costo de envío",
            summary: "Consultar costo de envío",
            parameters: [{
                description: "peso de la venta",
                name: "id",
                in: "weight",
                required: true,
                schema: {
                    type: "number",
                },
            }],
            responses: {
                "200": {
                    description: "",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ShippingCost",
                            },
                        },
                    },
                },
                "500": {
                    description: "Hubo un error al consultar la información",
                },
            },
        },

    },

};

export { shippingCost };
