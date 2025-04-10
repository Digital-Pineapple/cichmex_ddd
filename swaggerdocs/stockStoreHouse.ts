const stockStorehouse = {
    "/stock-StoreHouse": {
        get: {
            tags: ["Stock Storehouse"],
            description: "Todo el stock",
            parameters: [],
            responses: {
                200: {
                    description: "Todo el stock",
                    content: {
                        "application/json": {
                            schema: {
                                type: "array",
                                items: {
                                    $ref: "#/components/schemas/StockStoreHouse",
                                },
                            },
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
                }
            }
        }
    },
    "/stock-StoreHouse/all-inputs": {
        get: {
            tags: ["Stock Storehouse"],
            description: "Todas las entradas",
            parameters: [],
            responses: {
                200: {
                    description: "Todas las entradas",
                    content: {
                        "application/json": {
                            type: "object",
                            properties: {
                                data: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/StockStoreHouse",
                                    },
                                },
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
                }
            }
        }
    },
    "/stock-StoreHouse/all-outputs": {
        get: {
            tags: ["Stock Storehouse"],
            description: "Obtiene todas las salidas de stock",
            responses: {
                200: {
                    description: "Lista de todas las salidas de stock",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/StockStoreHouse"
                                        }
                                    }
                                },
                            }
                        }
                    }
                },
                500: {
                    description: "Error interno del servidor",
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
    "/stock-StoreHouse/all-movements": {
        get: {
            tags: ["Stock Storehouse"],
            description: "Obtiene todas los movimientos",
            responses: {
                200: {
                    description: "Lista de todas los movimientos",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/StockStoreHouse"
                                        }
                                    }
                                },
                            }
                        }
                    }
                },
                500: {
                    description: "Error interno del servidor",
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
    "/stock-StoreHouse/available/ok": {
        get: {
            tags: ["Stock Storehouse"],
            description: "Obtiene todo el stock disponible",
            responses: {
                200: {
                    description: "Lista stock ",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/StockStoreHouse"
                                        }
                                    }
                                },
                            }
                        }
                    }
                },
                500: {
                    description: "Error interno del servidor",
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
    "/stock-StoreHouse/inputs_pending": {
        get: {
            tags: ["Stock Storehouse"],
            description: "Todas la entradas pendientes",
            responses: {
                200: {
                    description: "Lista stock ",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/StockStoreHouse"
                                        }
                                    }
                                },
                            }
                        }
                    }
                },
                500: {
                    description: "Error interno del servidor",
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
    "/stock-StoreHouse/inputs_pending_by_folio": {
        get: {
            tags: ["Stock Storehouse"],
            description: "Todas la entradas pendientes por folio",
            responses: {
                200: {
                    description: "Lista stock ",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/StockStoreHouse"
                                        }
                                    }
                                },
                            }
                        }
                    }
                },
                500: {
                    description: "Error interno del servidor",
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
    "/stock-StoreHouse/inputs_by_folio/{folio}": {
        get: {
            tags: ["Stock Storehouse"],
            description: "Todas las entradas por folio",
            responses: {
                200: {
                    description: "Lista stock ",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/StockStoreHouse"
                                        }
                                    }
                                },
                            }
                        }
                    }
                },
                500: {
                    description: "Error interno del servidor",
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
    "/stock-StoreHouse/inputs_report/{folio}": {
        get: {
            tags: ["Stock Storehouse"],
            description: "Reporte de entradas por folio",
            responses: {
                200: {
                    description: "Lista stock ",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/StockStoreHouse"
                                        }
                                    }
                                },
                            }
                        }
                    }
                },
                500: {
                    description: "Error interno del servidor",
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
    "/stock-StoreHouse/inputs/ready_to_accommodate": {
        get: {
            tags: ["Stock Storehouse"],
            description: "Entradas listas para acomodar",
            responses: {
                200: {
                    description: "Lista stock ",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/StockStoreHouse"
                                        }
                                    }
                                },
                            }
                        }
                    }
                },
                500: {
                    description: "Error interno del servidor",
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
    "/stock-StoreHouse/add/multiple-entries": {
        post : {
            tags: ["Stock Storehouse"],
            description: "Agregar varias entradas",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "array",
                            items:{
                                $ref: "#/components/schemas/Products"
                            },
                        },
                    }
                }
            },                  
            responses: {
                200: {
                    description: "Agregar varias entradas",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/StockStoreHouse"
                                        }
                                    }
                                },
                            }
                        }
                    }
                },
                500: {
                    description: "Error interno del servidor",
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
    "/stock-StoreHouse/add/multiple-outputs": {
        post : {
            tags: ["Stock Storehouse"],
            description: "Agregar varias salidas",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "array",
                            items:{
                                $ref: "#/components/schemas/Products"
                            },
                        },
                    }
                }
            },                  
            responses: {
                200: {
                    description: "Agregar varias entradas",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/StockStoreHouse"
                                        }
                                    }
                                },
                            }
                        }
                    }
                },
                500: {
                    description: "Error interno del servidor",
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
    "/stock-StoreHouse/authorize/inputs": {
        post : {
            tags: ["Stock Storehouse"],
            description: "Autorizar entradas al almacen",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "array",
                            items:{
                                $ref: "#/components/schemas/Products"
                            },
                        },
                    }
                }
            },                  
            responses: {
                200: {
                    description: "Autorizar varias entradas",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/StockStoreHouse"
                                        }
                                    }
                                },
                            }
                        }
                    }
                },
                500: {
                    description: "Error interno del servidor",
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
    "/stock-StoreHouse/input/in_section/{id}": {
        post : {
            tags: ["Stock Storehouse"],
            description: "Buscar entrada en sección",
            parameters: [
                {
                    in: "path",
                    name: "id de la sección",
                    required: true,
                    schema: {
                        type: "string"
                        }
                        }
                        ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "array",
                            items:{
                                $ref: "#/components/schemas/Products"
                            },
                        },
                    }
                }
            },                  
            responses: {
                200: {
                    description: "Autorizar varias entradas",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/StockStoreHouse"
                                        }
                                    },
                                    message:{
                                        type: "string",
                                        example: "Se agregó producto a sección"
                                    }
                                },
                            }
                        }
                    }
                },
                500: {
                    description: "Error interno del servidor",
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
export { stockStorehouse }