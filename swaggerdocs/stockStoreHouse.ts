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
    }
}
export { stockStorehouse }