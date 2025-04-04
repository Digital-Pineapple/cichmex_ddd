import _ from "mongoose-paginate-v2";

const discountCoupon: any = {
    "/discounts/all": {
        get: {
            tags: ["Discounts"],
            description: "Get all discount coupons",
            summary: "Todos los cupones de descuento activos o inactivos",
            responses: {
                "200": {
                    description: " Cupones de descuento obtenidos exitosamente",
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
                                                _id: { type: "string", example: "64f5b4a2c8d3e1e3f8c8e4b2" },
                                                uuid: { type: "string", example: "64f5b4a2c8d3e1e3f8c8e4b2" },
                                                name: { type: "string", example: "Cupon de descuento" },
                                                description: { type: "string", example: "Descripción del cupon" },
                                                code: { type: "string", example: "DESCUENTO10" },
                                                percent: { type: "number", example: 10 },
                                                fixed_amount: { type: "number", example: 5 },
                                                type_discount: { type: "string", example: "is_percent" },
                                                unlimited: { type: "boolean", example: true },
                                                start_date: { type: "string", example: "2023-09-01T12:00:00Z" },
                                                expiration_date: { type: "string", example: "2023-09-30T12:00:00Z" },
                                                min_cart_amount: { type: "number", example: 50 },
                                                max_cart_amount: { type: "number", example: 100 },
                                                for_all_products: { type: "boolean", example: true },
                                                products: {
                                                    type: "array",
                                                    items: {
                                                        type: "object",
                                                        properties: {
                                                            _id: { type: "string", example: "64f5b4a2c8d3e1e3f8c8e4b2" },
                                                            name: { type: "string", example: "Producto 1" },
                                                            price: { type: "number", example: 20 },
                                                        },
                                                    },
                                                },
                                                creator_id: { type: "string", example: "64f5b4a2c8d3e1e3f8c8e4b2" },
                                                status: { type: "boolean", example: true },
                                                is_active: { type: "boolean", example: true },
                                                maxUses: { type: "number", example: 100 },
                                                createdAt: { type: "string", example: "2023-09-01T12:00:00Z" },
                                                updatedAt: { type: "string", example: "2023-09-01T12:00:00Z" },

                                            },
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
                "401": {
                    description: "Error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "El token es requerido" },
                                },
                            },
                        },
                    },
                }
            },
        },
    },
    "/discounts/get_one/{id}": {
        get: {
            tags: ["Discounts"],
            description: "Get one discount coupon",
            summary: "Información de un cupon de descuento",
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
                                                _id: { type: "string", example: "64f5b4a2c8d3e1e3f8c8e4b2" },
                                                is_active: { type: "boolean", example: true },
                                                no_slide: { type: "number", example: 1 },
                                                for_discount: { type: "boolean", example: true },
                                                title: { type: "string", example: "Banner Title" },
                                                description: { type: "string", example: "Banner Description" },
                                                type_event: { type: "string", example: "with-click" },
                                                discount: { type: "string" },
                                                image_slide: { type: "string" },
                                                image_slide_movil: { type: "string" },
                                                createdAt: { type: "string", example: "2023-09-01T12:00:00Z" },
                                                updatedAt: { type: "string", example: "2023-09-01T12:00:00Z" },
                                            },
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
                "401": {
                    description: "Error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "El token es requerido" },
                                },
                            },
                        },
                    },
                }
            },
        },
    },
    "/discounts/find": {
        post: {
            tags: ["Discounts"],
            description: "Buscar un cupon de descuento",
            summary: "Buscar un cupon de descuento",
            parameters: [],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                code: { type: "string", example: "DESCUENTO10" },
                            },
                        },
                    },
                },
            },
            responses: {
                "200": {
                    description: "Cupon de descuento encontrado",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    _id: { type: "string", example: "64f5b4a2c8d3e1e3f8c8e4b2" },
                                    is_active: { type: "boolean", example: true },
                                    no_slide: { type: "number", example: 1 },
                                    for_discount: { type: "boolean", example: true },
                                    title: { type: "string", example: "Banner Title" },
                                    description: { type: "string", example: "Banner Description" },
                                    type_event: { type: "string", example: "with-click" },
                                    discount: { type: "string" },
                                    image_slide: { type: "string" },
                                    image_slide_movil: { type: "string" },
                                    createdAt: { type: "string", example: "2023-09-01T12:00:00Z" },
                                    updatedAt: { type: "string", example: "2023-09-01T12:00:00Z" },
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
                }
            },
        },
    },
    "/discounts": {
        post: {
            tags: ["Discounts"],
            description: "Crear un cupon de descuento",
            summary: "Crear un cupon de descuento",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {

                                values:{
                                    type: "object",
                                    properties: { 
                                        name: { type: "string", example: "Cupon de descuento" },
                                        description: { type: "string", example: "Descripción del cupon" },
                                        code: { type: "string", example: "DESCUENTO10" },
                                        percent: { type: "number", example: 10 },
                                        fixed_amount: { type: "number", example: 5 },
                                        type_discount: { type: "string", example: "is_percent" },
                                        unlimited: { type: "boolean", example: true },
                                        start_date: { type: "string", example: "2023-09-01T12:00:00Z" },
                                        expiration_date: { type: "string", example: "2023-09-30T12:00:00Z" },
                                        min_cart_amount: { type: "number", example: 50 },
                                        max_cart_amount: { type: "number", example: 100 },
                                        for_all_products: { type: "boolean", example: true },
                                        products_id_list :{
                                            type:"array",
                                            items:{
                                                type:"string"
                                            }
                                        }, 
                                        maxUses: { type: "number", example: 100 },
                                        creator_id: { type: "string", example: "64f5b4a2c8d3e1e3f8c8e4b2" },
                                        status: { type: "boolean", example: true },
                                        is_active: { type: "boolean", example: false },

                                    }
                                }
            
                            },
                        },
                    },
                },
            },

            responses: {
                "200": {
                    description:
                        "Cupon de descuento creado exitosamente",
                    content:{
                        'application/json':{
                            schema:{
                                $ref:"#/components/schemas/DiscountCoupon"
                            }
                        }
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
                "401": {
                    description: "Error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "El token es requerido" },
                                },
                            },
                        },
                    },
                }
            }
        }
    },
    "/discounts/consume": {
        post: {
            tags: ["Discounts"],
            description: "Consumir un cupon de descuento",
            summary: "Consumir un cupon de descuento",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                code: { type: "string", example: "DESCUENTO10" },
                                shopping_cart_id: { type: "string", example: "64f5b4a2c8d3e1e3f8c8e4b2" },
                            },
                        },
                    },
                },
            },

            responses: {
                "200": {
                    description:
                        "Cupon de descuento consumido exitosamente",
                    content:{
                        'application/json':{
                            schema:{
                                $ref:"#/components/schemas/DiscountCoupon"
                            }
                        }
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
                "401": {
                    description: "Error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "El token es requerido" },
                                },
                            },
                        },
                    },
                }
            }
        }
    },
    "/discounts/update/{id}": {
        put: {
            tags: ["Discounts"],
            description: "Actualizar un cupon de descuento",
            summary: "Actualizar un cupon de descuento",
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
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                name: { type: "string", example: "Cupon de descuento" },
                                description: { type: "string", example: "Descripción del cupon" },
                                code: { type: "string", example: "DESCUENTO10" },
                                percent: { type: "number", example: 10 },
                                fixed_amount: { type: "number", example: 5 },
                                type_discount: { type: "string", example: "is_percent" },
                                unlimited: { type: "boolean", example: true },
                                start_date: { type: "string", example: "2023-09-01T12:00:00Z" },
                                expiration_date: { type: "string", example: "2023-09-30T12:00:00Z" },
                                min_cart_amount:{type:"number",example:"50"},
                                max_cart_amount:{type:"number",example:"100"},
                                for_all_products:{type:"boolean",example:true},
                            },
                        },
                    },
                },
            },

            responses:{
                '200':{
                    description:"Cupon de descuento actualizado exitosamente",
                    content:{
                        'application/json':{
                            schema:{
                                $ref:"#/components/schemas/DiscountCoupon"
                            }
                        }
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
                "401": {
                    description: "Error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "El token es requerido" },
                                },
                            },
                        },
                    },
                }
            }
        }
    },
    "/discounts/changeActive/{id}": {
        put: {
            tags: ["Discounts"],
            description: "Cambiar el estado de un cupon de descuento",
            summary: "Cambiar el estado de un cupon de descuento",
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
            responses:{
                '200':{
                    description:"Cupon de descuento actualizado exitosamente",
                    content:{
                        'application/json':{
                            schema:{
                                $ref:"#/components/schemas/DiscountCoupon"
                            }
                        }
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
                "401": {
                    description: "Error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "El token es requerido" },
                                },
                            },
                        },
                    },
                }
            }
        }
    },
    "/discounts/{id}": {
        delete: {
            tags: ["Discounts"],
            description: "Eliminar un cupon de descuento",
            summary: "Eliminar un cupon de descuento",
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
            responses:{
                '200':{
                    description:"Cupon de descuento eliminado exitosamente",
                    content:{
                        'application/json':{
                            schema:{
                                $ref:"#/components/schemas/DiscountCoupon"
                            }
                        }
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
                "401": {
                    description: "Error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "El token es requerido" },
                                },
                            },
                        },
                    },
                }
            }
        }
    }

}

export { discountCoupon };
