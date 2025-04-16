import { request } from "express"
import { product } from "./product"

const variantProduct = {
    "/variant-product": {
        post: {
            tags: ["VariantProduct"],
            summary: "Crear una nueva variante de producto",
            description: "Create a new variant product",
            operationId: "createVariantProduct",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                body: {
                                    type: "object",
                                    $ref: "#/components/schemas/VariantProduct"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Variant product created successfully"
                },
                400: {
                    description: "Bad request"
                },
                500: {
                    description: "Internal server error"
                }
            }
        }
    },
    "/variant-product/update/{id}": {
        post: {
            tags: ["VariantProduct"],
            summary: "Actualizar una variante de producto",
            description: "Update a variant product",
            operationId: "updateVariantProduct",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID de la variante de producto a actualizar",
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
                            type: "object",
                            properties: {
                                body: {
                                    type: "object",
                                    $ref: "#/components/schemas/VariantProduct"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Variant product updated successfully"
                },
                400: {
                    description: "Bad request"
                },
                500: {
                    description: "Internal server error"
                }
            }
        }
    },
    "/variant-product/addVariant/newSize": {
        post: {
            tags: ["VariantProduct"],
            summary: "Agregar un nuevo tamaño a una variante de producto",
            description: "Add a new size to a variant product",
            operationId: "addNewSizeToVariantProduct",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                body: {
                                    type: "object",
                                    $ref: "#/components/schemas/VariantProduct"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "New size added to variant product successfully"
                },
                400: {
                    description: "Bad request"
                },
                500: {
                    description: "Internal server error"
                }
            }
        }
    },
    "/variant-product/update-is-main/ok/{id}": {
        post: {
            tags: ["VariantProduct"],
            summary: "Actualizar la variante principal de un producto",
            description: "Update the main variant of a product",
            operationId: "updateMainVariant",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID de la variante de producto a actualizar",
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
                            type: "object",
                            properties: {
                                color: {
                                    type: "string",
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Main variant updated successfully"
                },
                400: {
                    description: "Bad request"
                },
                500: {
                    description: "Internal server error"
                }
            }
        }
    },
    "/variant-product/update/oneVariant/{id}": {
        post: {
            tags: ["VariantProduct"],
            summary: "Actualizar una variante de producto",
            description: "Update a variant product",
            operationId: "updateOneVariantProduct",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID de la variante de producto a actualizar",
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
                            type: "object",
                            properties: {
                                variant_id: {
                                    type: "string",
                                    description: "ID de la variante de producto a actualizar"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Variant product updated successfully"
                },
                400: {
                    description: "Bad request"
                },
                500: {
                    description: "Internal server error"
                }
            }
        }
    },
    "/variant-product/updateImages": {
        post: {
            tags: ["VariantProduct"],
            summary: "Actualizar imágenes de una variante de producto",
            description: "Update images of a variant product",
            operationId: "updateVariantProductImages",
            requestBody: {
                required: true,
                content: {
                    "multipart/form-data": {
                        schema: {
                            type: "object",
                            properties: {
                                color: {
                                    type: "string",
                                    description: "Color de la variante de producto"
                                },
                                product_id: {
                                    type: "string",
                                    description: "ID del producto"
                                },
                                images: {
                                    type: "array",
                                    items: {
                                        type: "string",
                                        format: "binary"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Variant product images updated successfully"
                },
                400: {
                    description: "Bad request"
                },
                500: {
                    description: "Internal server error"
                }
            }
        }
    },
    "/variant-product/delete-image/{id}": {
        post: {
            tags: ["VariantProduct"],
            summary: "Eliminar una imagen de una variante de producto",
            description: "Delete an image from a variant product",
            operationId: "deleteVariantProductImage",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID de la variante de producto",
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
                            type: "object",
                            properties: {
                                image_id: {
                                    type: "string",
                                    description: "id de la imagen a eliminar"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Se eliminó la imagen con éxito"
                },
                400: {
                    description: "Bad request"
                },
                500: {
                    description: "Internal server error"
                }
            }
        }
    },
    "/variant-product/{id}": {
        delete: {
            tags: ["VariantProduct"],
            summary: "Eliminar una variante de producto",
            description: "Delete a variant product",
            operationId: "deleteVariantProduct",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID de la variante de producto a eliminar",
                    schema: {
                        type: "string"
                    }
                }
            ],
            responses: {
                200: {
                    description: "Se eliminó con éxito"
                },
                400: {
                    description: "Elimina stock de variante"
                },
                500: {
                    description: "Hubo un error al eliminar la variante"
                }
            }
        }
    }



}
export { variantProduct }