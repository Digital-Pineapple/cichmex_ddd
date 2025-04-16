const sizeGuide: any = {
    "/size-guide": {
        get: {
            tags: ["Size Guide"],
            description: "Todas las guías de tallas",
            summary: "Todas las guías de tallas",
            parameters: [],
            responses: {
                "200": {
                    description: "",
                    content: {
                        "application/json": {
                            schema: {
                                type: "array",
                                items: {
                                    $ref: "#/components/schemas/SizeGuide",
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
    },
    "/size-guide/{id}": {
        get: {
            tags: ["Size Guide"],
            description: "Obtener una guia de tallas",
            summary: "obtener un costo de envío",
            parameters: [{
                description: "id de la guia de tallas",
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
                                $ref: "#/components/schemas/SizeGuide",
                            },
                        },
                    },
                },
                "500": {
                    description: "Hubo un error al consultar la información",
                },
            },
        },
        delete: {
            tags: ["Size Guide"],
            description: "Eliminar guía de tallas",
            summary: "Eliminar guía de tallas",
            parameters: [{
                description: "id de la guia de tallas",
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
                                    { $ref: "#/components/schemas/SizeGuide" }, // Toma la referencia del modelo Category
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
    "/size-guide/allGuides": {
        get: {
            tags: ["Size Guide"],
            description: "Consultar guia de tallas por usuario",
            summary: "Consultar guia de tallas por usuario",
           
            responses: {
                "200": {
                    description: "",
                    content: {
                        "application/json": {
                            schema: {
                                type: "array",
                                items:{
                                    $ref: "#/components/schemas/ShippingCost",
                                }
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
    "size-guide/addOne":{
        post: {
            tags: ["Size Guide"],
            description: "Crear una guia de medidas",
            summary: "Crear una guía de medidas",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/SizeGuide"
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
                                $ref: "#/components/schemas/SizeGuide",
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
    "size-guide/update/{id}":{
        put: {
            tags: ["Size Guide"],
            description: "Editar una guia de medidas",
            summary: "Editar una guía de medidas",
            parameters: [{
                description: "id de la guia de tallas",
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
                            $ref: "#/components/schemas/SizeGuide"
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
                                $ref: "#/components/schemas/SizeGuide",
                            },
                        },
                    },
                },
                "500": {
                    description: "Hubo un error al crear",
                },
            },
        },
    }

};

export { sizeGuide };
