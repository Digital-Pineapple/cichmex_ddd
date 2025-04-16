
const memberships: any = {
    "/memberships": {
        get: {
            tags: ["Memberships"],
            description: "Obtener todas las membresías",
            summary: "Obtener todas las membresías",
            responses: {
                "200": {
                    description: "",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                _id: { type: "string", example: "64b2f4e9c0f4d3b1a8e6f5e1" },
                                                name: { type: "string", example: "Membresía Premium" },
                                                price_standard: { type: "number", example: 100 },
                                                discount_porcent: { type: "number", example: 10 },
                                                discount_products: { type: "number", example: 5 },
                                                price_discount: { type: "number", example: 90 },
                                                service_quantity: {
                                                    type: "array",
                                                    items: {
                                                        type: "object",
                                                        properties: {
                                                            service_id: {
                                                                type: "string",
                                                                example: "64b2f4e9c0f4d3b1a8e6f5e2",
                                                            },
                                                            quantity: {
                                                                type: "number",
                                                                example: 5,
                                                            },
                                                        }

                                                    },
                                                },
                                                type_cars: {
                                                    type: "array",
                                                    items: {
                                                        type: "object",
                                                        properties: {
                                                            _id: { type: "string", example: "64b2f4e9c0f4d3b1a8e6f5e2" },
                                                            name: { type: "string", example: "Tipo de auto 1" },

                                                        },
                                                    },
                                                },
                                                status: { type: "boolean", example: true },
                                                createdAt: { type: "string", example: "2023-10-01T12:00:00Z" },
                                                updatedAt: { type: "string", example: "2023-10-01T12:00:00Z" },
                                            },
                                        },
                                    },
                                },

                            },
                        },
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
                },
            }
        },
        post:{
            tags: ["Memberships"],
            description: "Crear nueva membresía",
            summary: "Crear nueva membresía",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                name: { type: "string", example: "Membresía Premium" },
                                price_standard: { type: "number", example: 100 },
                                discount_porcent: { type: "number", example: 10 },
                                discount_products: { type: "number", example: 5 },
                                service_quantity: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            service_id: { type: "string", example: "64b2f4e9c0f4d3b1a8e6f5e2" },
                                            quantity: { type: "number", example: 5 },
                                        },
                                    },
                                },
                                type_cars:{
                                    type:"array",
                                    items:{
                                        type:"string",
                                        example:"65e217a80943149b6988109f"
                                    }
                                }
                            },
                        },
                    },
                },
            },
            responses:{
                '201':{
                    description:'Membresía creada con éxito',
                    content:{
                        'application/json':{
                            schema:{
                                type:'object',
                                properties:{
                                    message:{type:'string',example:'Alta con exito'}
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/memberships/{id}": {
        get: {
            tags: ["Memberships"],
            description: "Obtener membresía por ID",
            summary: "Obtener membresía por ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID de la membresía",
                    schema: {
                        type: "string",
                        example: "64b2f4e9c0f4d3b1a8e6f5e1",
                    },
                },
            ],
            responses: {
                "200": {
                    description: "",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                _id: { type: "string", example: "64b2f4e9c0f4d3b1a8e6f5e1" },
                                                name: { type: "string", example: "Membresía Premium" },
                                                price_standard: { type: "number", example: 100 },
                                                discount_porcent: { type: "number", example: 10 },
                                                discount_products: { type: "number", example: 5 },
                                                price_discount: { type: "number", example: 90 },
                                                service_quantity: {
                                                    type: "array",
                                                    items: {
                                                        type: "object",
                                                        properties: {
                                                            service_id: {
                                                                type: "string",
                                                                example: "64b2f4e9c0f4d3b1a8e6f5e2",
                                                            },
                                                            quantity: {
                                                                type: "number",
                                                                example: 5,
                                                            },
                                                        }

                                                    },
                                                },
                                                type_cars: {
                                                    type: "array",
                                                    items: {
                                                        type: "object",
                                                        properties: {
                                                            string: { type: "string", example: "65e217a80943149b6988109f" },

                                                        },
                                                    },
                                                },
                                                status: { type: "boolean", example: true },
                                                createdAt: { type: "string", example: "2023-10-01T12:00:00Z" },
                                                updatedAt: { type: "string", example: "2023-10-01T12:00:00Z" },
                                            },
                                        },
                                    },
                                },

                            },
                        },
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
                },
            }
        },
        patch:{
            tags: ["Memberships"],
            description: "Actualizar membresía por ID",
            summary: "Actualizar membresía por ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID de la membresía",
                    schema: {
                        type: "string",
                        example: "64b2f4e9c0f4d3b1a8e6f5e1",
                    },
                },
            ],
            requestBody:{
                required:true,
                content:{
                    'application/json':{
                        schema:{
                            type:'object',
                            properties:{
                                name:{type:'string',example:'Membresía Premium'},
                                price_standard:{type:'number',example:100},
                                price_discount:{type:'number',example:90},
                                service_quantity:{
                                    type:'array',
                                    items:{
                                        type:'object',
                                        properties:{
                                            service_id:{type:'string',example:'64b2f4e9c0f4d3b1a8e6f5e2'},
                                            quantity:{type:'number',example:5}
                                        }
                                    }
                                },
                                status:{type:'boolean',example:true}
                            }
                        }
                    }
                }
            },
            responses:{
                '201':{
                    description:'Membresía actualizada con éxito',
                    content:{
                        'application/json':{
                            schema:{
                                type:'object',
                                properties:{
                                    message:{type:'string',example:'Actualización con éxito'}
                                }
                            }
                        }
                    }
                }
            }
        },
        delete:{
            tags: ["Memberships"],
            description: "Eliminar membresía por ID",
            summary: "Eliminar membresía por ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID de la membresía",
                    schema: {
                        type: "string",
                        example: "64b2f4e9c0f4d3b1a8e6f5e1",
                    },
                },
            ],
            responses:{
                '201':{
                    description:'Membresía eliminada con éxito',
                    content:{
                        'application/json':{
                            schema:{
                                type:'object',
                                properties:{
                                    message:{type:'string',example:'Eliminación con éxito'}
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/memberships/info/{id}": {
        get: {
            tags: ["Memberships"],
            description: "Obtener detalle de membresía por ID",
            summary: "Obtener detalle de membresía por ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID de la membresía",
                    schema: {
                        type: "string",
                        example: "64b2f4e9c0f4d3b1a8e6f5e1",
                    },
                },
            ],
            responses: {
                "200": {
                    description: "",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                _id: { type: "string", example: "64b2f4e9c0f4d3b1a8e6f5e1" },
                                                name: { type: "string", example: "Membresía Premium" },
                                                price_standard: { type: "number", example: 100 },
                                                discount_porcent: { type: "number", example: 10 },
                                                discount_products: { type: "number", example: 5 },
                                                price_discount: { type: "number", example: 90 },
                                                service_quantity: {
                                                    type: "array",
                                                    items: {
                                                        type: "object",
                                                        properties: {
                                                            service_id: {
                                                                type: "string",
                                                                example: "64b2f4e9c0f4d3b1a8e6f5e2",
                                                            },
                                                            name: { type: "string", example: "Servicio 1" },
                                                            description: { type: "string", example: "Descripción del servicio" },
                                                            quantity: {
                                                                type: "number",
                                                                example: 5,
                                                            },
                                                        }

                                                    },
                                                },
                                                type_cars: {
                                                    type: "array",
                                                    items: {
                                                        type: "object",
                                                        properties: {
                                                            id: { type: "string", example: "65e217a80943149b6988109f" },
                                                            name: { type: "string", example: "Tipo de auto 1" },
                                                        },
                                                    },
                                                },
                                                status: { type: "boolean", example: true },
                                                createdAt: { type: "string", example: "2023-10-01T12:00:00Z" },
                                                updatedAt: { type: "string", example: "2023-10-01T12:00:00Z" },
                                            },
                                        },
                                    },
                                },

                            },
                        },
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
                },
            }
        },
    },




}

export { memberships };
