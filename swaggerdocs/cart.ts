const cart = {
    "/shopping-cart": {
        get: {
            tags: ["Cart"],
            description: "Retorna el carrito del usuario",
            parameters: [],
            "responses": {
                "200": {
                  "description": "Carrito obtenido",
                  "content": {
                    "application/json": {
                      "schema": {
                        "type": "object",                        
                          "$ref": "#/components/schemas/CartResponse"                        
                      }
                    }
                  }
                },              
                "500": {
                  "description": "Hubo un error al obtener el carrito"
                }
              }
        },
    },
    "/shopping-cart/:id" : {
        delete: {
            tags: ["Cart"],
            description: "Eliminar carrito",
            parameters: [
                {
                    name: "id",
                    in: "params",
                    description: "id del carrito del usuario"
                }
            ]
        }
    },
    "/shopping-cart/product/:id" : {
        post:{
            tags: ["Cart"],
            description: "Agregar producto a carrito",
            parameters: [
                {
                    name: "id",
                    in: "params",
                    description: "id del producto",
                    required: true
                },
                {
                    name: "variant",
                    in: "body",
                    description: "id de la variante del producto"
                },
                {
                    name: "quantity",
                    in: "body",
                    description: "cantidad del producto",
                    required: true
                }

            ]       
        },
        delete: {
            tags: ["Cart"],
            description: "Eliminar producto del carrito",
            parameters: [
                {
                    name: "id",
                    in: "params",
                    description: "id del item del carrito",
                    required: true
                }
            ],
            responses: {
                "200": {
                    description: "Producto eliminado del carrito",
                    // content: {
                    //     "application/json": {
                    //         schema: {
                    //             type: "object",
                    //             $ref: "#/components/schemas/CartResponse"
                    //         }
                    //     }
                    // }
                },
                "500": {
                    description: "Hubo un error al eliminar el producto del carrito"
                }
            }
        }        

    },
    "/shopping-cart/product/update-quantity":{
        put: {
            tags: ["Cart"],
            description: "Actualiza la cantidad del producto en el carrito",
            parameters: [
                {
                    name: "id",
                    in: "body",
                    description: "id del item del carrito",
                    required: true
                },
                {
                    name: "quantity",
                    in: "body",
                    description: "cantidad del producto",
                    required: true,                    
                }
            ],
            responses: {
                "200": {
                    description: "Cantidad del producto actualizada",
                    // content: {
                    //     "application/json": {
                    //         schema: {
                    //             type: "object",
                    //             $ref: "#/components/schemas/CartResponse"
                    //         }
                    //     }
                    // }
                },
                "500": {
                    description: "Hubo un error al actualizar la cantidad del producto"
                }
            }

        }
    },
    "/shopping-cart/product/replace-quantity":{        
        put: {
            tags: ["Cart"],
            description: "Remplaza la cantidad del producto en el carrito",
            parameters: [
                {
                    name: "id",
                    in: "body",
                    description: "id del item del carrito",
                    required: true
                },
                {
                    name: "quantity",
                    in: "body",
                    description: "nueva cantidad del producto",
                    required: true,                    
                }
            ],
            responses: {
                "200": {
                    description: "Cantidad del producto actualizada",
                    // content: {
                    //     "application/json": {
                    //         schema: {
                    //             type: "object",
                    //             $ref: "#/components/schemas/CartResponse"
                    //         }
                    //     }
                    // }
                },
                "500": {
                    description: "Hubo un error al actualizar la cantidad del producto"
                }
            }

        }
    },
    "/shopping-cart/merge/ok": {
        put : {
            tags: ["Cart"],
            description: "merge de productos con carrito del usuario",
            parameters: [
                {
                    name: "products",
                    type: "object",
                    description: "productos del carrito local",
                    in: "body",
                    required: true,   
                    example: [
                        {
                            _id: "id del item del carrito",
                            item: "id del producto",                            
                            variant: "id de variante del producto",
                            quantity: "cantidad del producto"
                        }
                    ]                 
                }
            ]

        }
    }, 
    "/shopping-cart/no-auth": {
        post: {
            tags: ["Cart"],
            description: "retorna los productos del carrito del usuario no logueado",
            parameters: [
                  {
                    name: "products",
                    type: "object",
                    description: "productos del carrito en almacenamineto local",
                    in: "body",
                    required: true,   
                    example: [
                        {
                            _id: "id del item del carrito",
                            item: "id del producto",                            
                            variant: "id de variante del producto",
                            quantity: "cantidad del producto"
                        }
                    ]                 
                }
            ],
            responses: {
                "200": {
                    description: "Productos del carrito obtenidos",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                $ref: "#/components/schemas/Products"
                            }
                        }
                    }
                },
                "500": {
                    description: "Hubo un error al obtener los productos del carrito"
                }
            }
        }

    }
}

export { cart };