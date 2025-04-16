
const product = {
    "/product": {
        "get": {
            "tags": [
                "Product"
            ],
            "summary": "Todos los productos",
            "responses": {
                "200": {
                    "description": "Successful response",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/Products"
                            }
                        }
                    }
                },
                "500": {
                    "description": "Hubo un error al consultar la información",
                }
            }
        }
    },
    "/product/paginate": {
        "get": {
            tags: [
                "Product"
            ],
            summary: "Lista de productos paginada",
            parameters: [
                {
                    name: "page",
                    in: "query",
                    description: "Número de página",
                    required: true,
                    schema: {
                        type: "integer"
                    }
                },
                {
                    name: "limit",
                    in: "query",
                    description: "Número de registros por página",
                    required: true,
                    schema: {
                        type: "integer"
                    }
                }
            ],
            responses: {
                200: {
                    description: "",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ProductsReponsePaginate"
                            }
                        }
                    }
                },
                500: {
                    "description": "Hubo un error al consultar la información",
                }
            }
        }
    },
    "/product/for_search": {
        "get": {
            tags: [
                "Product"
            ],
            summary: "Lista de productos por busqueda",
            responses: {
                200: {
                    description: "",
                    content: {
                        "application/json": {
                            type: "array",
                            items: {
                                $ref: "#/components/schemas/Products"
                            }
                        }
                    }
                },
                500: {
                    "description": "Hubo un error al consultar la información",
                }
            }
        }
    },
    "/product/{id}": {
        "get": {
            tags: [
                "Product"
            ],
            summary: "Obtener un producto por ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID del producto",
                    required: true,
                    schema: {
                        type: "string"
                    }
                }
            ],
            responses: {
                200: {
                    description: "",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Products"
                            }
                        }
                    }
                },
                500: {
                    "description": "Hubo un error al consultar la información",
                }
            }
        },
        delete:{
            tags: [
                "Product"
            ],
            summary: "Eliminar un producto por ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID del producto",
                    required: true,
                    schema: {
                        type: "string"
                    }
                }
            ],
            responses: {
                201: {
                    description: "Eliminado con éxito",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Products"
                            }
                        }
                    }
                },
                500: {
                    "description": "Hubo un error al eliminar el producto",
                }
            }
        }
    },
    "/product/non-existent/get": {
        get: {
            tags: [
                "Product"
            ],
            summary: "Lista de productos sin stock",
            responses: {
                200: {
                    description: "",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Products"
                            }
                        }
                    }
                },
                500: {
                    "description": "Hubo un error al consultar la información",
                }
            }
        }
    },
    "/product/productsByCategory/search": {
        "get": {
            tags: [
                "Product"
            ],
            summary: "Lista de productos por categoria",
            parameters: [
                {
                    name: "category_id",
                    in: "query",
                    description: "ID de la categoria",
                    required: true,
                    schema: {
                        type: "string"
                    }
                },

            ],
            responses: {
                200: {
                    description: "",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Products"
                            }
                        }
                    }
                },
                500: {
                    "description": "Hubo un error al consultar la información",
                }
            }
        }
    },
    "/product/productsBySubcategory/search": {
        "get": {
            tags: [
                "Product"
            ],
            summary: "Lista de productos por subcategoria",
            parameters: [
                {
                    name: "subCategory_id",
                    in: "query",
                    description: "ID de la subcategoria",
                    required: true,
                    schema: {
                        type: "string"
                    }
                },

            ],
            responses: {
                200: {
                    description: "",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Products"
                            }
                        }
                    }
                },
                500: {
                    "description": "Hubo un error al consultar la información",
                }
            }
        }
    },
    "/product/productsByCategories/ok": {
        "get": {
            tags: [
                "Product"
            ],
            summary: "Lista de productos por categorias",
            responses: {
                200: {
                    description: "",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ProductsReponsePaginate"
                            }
                        }
                    }
                },
                500: {
                    "description": "Hubo un error al consultar la información",
                }
            }
        }
    },
    "/product/recommendProducts/ok/{id}": {
        "get": {
            tags: [
                "Product"
            ],
            summary: "Lista de productos recomendados",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID del producto",
                    required: true,
                    schema: {
                        type: "string"
                    }
                },

            ],
            responses: {
                200: {
                    description: "",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Products"
                            }
                        }
                    }
                },
                500: {
                    "description": "Hubo un error al consultar la información",
                }
            }
        }
    },
    "/product/videos/ok": {
        "get": {
            tags: [
                "Product"
            ],
            summary: "Lista de videos",
            parameters: [
                {
                    name: "page",
                    in: "query",
                    description: "Número de página",
                    required: true,
                    schema: {
                        type: "integer"
                    }
                },

            ],
            responses: {
                200: {
                    description: "",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ProductsReponsePaginate"
                            }
                        }
                    }
                },
                500: {
                    "description": "Hubo un error al consultar la información",
                }
            }
        }
    },
    "/product/recentProducts/ok": {
        "get": {
            tags: [
                "Product"
            ],
            summary: "Lista de productos recientes",
            responses: {
                200: {
                    description: "",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Products"
                            }
                        }
                    }
                },
                500: {
                    "description": "Hubo un error al consultar la información",
                }
            }
        }
    },
    "/product/video/addVideo/{id}": {
        "post": {
            tags: [
                "Product"
            ],
            summary: "Agregar video a un producto",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID del producto",
                    required: true,
                    schema: {
                        type: "string"
                    }
                },

            ],
            requestBody: {
                required: true,
                content: {
                    "multipart/form-data": {
                        schema: {
                            type: "object",
                            properties: {
                                videos: {
                                    type: "string",
                                    description: "URL del video"
                                },
                                type: {
                                    type: "string",
                                    description: "Tipo de video"
                                }
                            },
                            required: ["videos"]
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
                                $ref: "#/components/schemas/Products"
                            }
                        }
                    }
                },
                500: {
                    "description": "Hubo un error al actualizar ",
                }
            }
        }
    },
    "/product/addProduct": {
        "post": {
            "tags": [
                "Product"
            ],
            "summary": "Crear un nuevo producto",
            "requestBody": {
                "required": true,
                "content": {
                    "multipart/form-data": {
                        "schema": {
                            "$ref": "#/components/schemas/Product"
                        }
                    }
                }
            },
            "responses": {
                "201": {
                    "description": "Producto creado con éxito",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/Product"
                            }
                        }
                    }
                },
                "400": {
                    "description": "El producto ya existe"
                },
                "500": {
                    "description": "Hubo un error al crear el producto"
                }
            }
        }
    },

    "/products/createProductWithVariants/ok": {
        "post": {
            tags: [
                "Product"
            ],
            summary: "Crear un nuevo producto con variantes",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/Product"
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Producto creado con éxito",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Product"
                            }
                        }
                    }
                },
                400: {
                    description: "El producto ya existe",
                },
                500: {
                    "description": "Hubo un error al crear el producto",
                }
            }
        }
    },
    "/product/addVariants/{id}": {
        "post": {
            tags: [
                "Product"
            ],
            summary: "Agregar variantes a un producto",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID del producto",
                    required: true,
                    schema: {
                        type: "string"
                    }
                },

            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                variants: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/VariantProduct"
                                    }
                                }
                            },
                            required: ["variants"]
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
                                $ref: "#/components/schemas/Product"
                            }
                        }
                    }
                },
                500: {
                    "description": "Hubo un error al agregar variantes",
                }
            }
        }
    },
    "/product/addVariants/clothes-shoes/{id}": {
        "post": {
            tags: [
                "Product"
            ],
            summary: "Agregar variantes a un producto",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID del producto",
                    required: true,
                    schema: {
                        type: "string"
                    }
                },

            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                variants: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/VariantProduct"
                                    }
                                }
                            },
                            required: ["variants"]
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
                                $ref: "#/components/schemas/Product"
                            }
                        }
                    }
                },
                500: {
                    "description": "Hubo un error al agregar variantes",
                }
            }
        }
    },
    "/product/selectSizeGuide/{id}": {
        "post": {
            tags: [
                "Product"
            ],
            summary: "Seleccionar guia de tallas",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID del producto",
                    required: true,
                    schema: {
                        type: "string"
                    }
                },

            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                sizeGuideId: {
                                    type: "string",
                                    description: "ID de la guia de tallas"
                                }
                            },
                            required: ["sizeGuideId"]
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
                                $ref: "#/components/schemas/Product"
                            }
                        }
                    }
                },
                500: {
                    "description": "Hubo un error al seleccionar la guia de tallas",
                }
            }
        }
    },
    "/product/search-category": {
        "post": {
            tags: [
                "Product"
            ],
            summary: "Buscar productos por categoria",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                category: {
                                    type: "string",
                                    description: "ID de la categoria"
                                },
                            },
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
                                type: "array",
                                items: {
                                    $ref: "#/components/schemas/Products"
                                }
                            }
                        }
                    }
                },
                500: {
                    "description": "Hubo un error al consultar la información",
                }
            }
        }
    },
    "/product/updateInfo/{id}": {
        "post": {
            tags: [
                "Product"
            ],
            summary: "Actualizar un producto",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID del producto",
                    required: true,
                    schema: {
                        type: "string"
                    }
                },

            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/Product"
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
                                $ref: "#/components/schemas/Product"
                            }
                        }
                    }
                },
                500: {
                    "description": "Hubo un error al actualizar el producto",
                }
            }
        }
    },
    "/product/addImageDetail/{id}": {
        post: {
            tags: [
                "Product"
            ],
            summary: "Agregar imagen a un producto",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID del producto",
                    required: true,
                    schema: {
                        type: "string"
                    }
                },

            ],
            requestBody: {
                required: true,
                content: {
                    "multipart/form-data": {
                        schema: {
                            type: "object",
                            properties: {
                                image: {
                                    type: "object",
                                    properties: {
                                        url: {
                                            type: "string",
                                            description: "URL de la imagen"
                                        },
                                        color: {
                                            type: "string",
                                            description: "Color de la imagen"
                                        }
                                    }
                                }
                            },
                            required: ["images"]
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
                                $ref: "#/components/schemas/Product"
                            }
                        }
                    }
                },
                500: {
                    "description": "Hubo un error al agregar la imagen",
                }
            }
        }
    },
    "/product/deleteImageDetail/{id}": {
        post: {
            tags: [
                "Product"
            ],
            summary: "Eliminar imagen de un producto",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID del producto",
                    required: true,
                    schema: {
                        type: "string"
                    }
                },

            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                imageId: {
                                    type: "string",
                                    description: "ID de la imagen"
                                }
                            },
                            required: ["imageId"]
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
                                $ref: "#/components/schemas/Product"
                            }
                        }
                    }
                },
                500: {
                    "description": "Hubo un error al eliminar la imagen",
                }
            }
        }
    },
    "/product/deleteVideoDetail/{id}": {
        post: {
            tags: [
                "Product"
            ],
            summary: "Eliminar video de un producto",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID del producto",
                    required: true,
                    schema: {
                        type: "string"
                    }
                },

            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                video_id: {
                                    type: "string",
                                    description: "ID del video"
                                }
                            },
                            required: ["videoId"]
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
                                $ref: "#/components/schemas/Product"
                            }
                        }
                    }
                },
                500: {
                    "description": "Hubo un error al eliminar el video",
                }
            }
        }
    },
    "/product/search/ok": {
        post: {
            tags: [
                "Product"
            ],
            summary: "Buscar productos por nombre",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                search: {
                                    type: "string",
                                    description: "Nombre del producto"
                                }
                            },
                            required: ["search"]
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
                                type: "array",
                                items: {
                                    $ref: "#/components/schemas/Products"
                                }
                            }
                        }
                    }
                },
                500: {
                    "description": "Hubo un error al consultar la información",
                }
            }
        }
    },
    "/product/producsBySubCategory/ok": {
        post: {
            tags: [
                "Product"
            ],
            summary: "Buscar productos por subcategoria",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                subcategory: {
                                    type: "string",
                                    description: "ID de la subcategoria"
                                }
                            },
                            required: ["subCategoryId"]
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
                                type: "array",
                                items: {
                                    $ref: "#/components/schemas/Products"
                                }
                            }
                        }
                    }
                },
                500: {
                    "description": "Hubo un error al consultar la información",
                }
            }
        }
    },
    "/product/addDescriptionAndVideos/{id}": {
        post: {
            tags: [
                "Product"
            ],
            summary: "Agregar descripcion y videos a un producto",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID del producto",
                    required: true,
                    schema: {
                        type: "string"
                    }
                },

            ],
            requestBody: {
                required: true,
                content: {
                    "multipart/form-data": {
                        schema: {
                            type: "object",
                            properties: {
                                videos: {
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
                    description: "",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Product"
                            }
                        }
                    }
                },
                500: {
                    "description": "Hubo un error al agregar la descripcion y videos",
                }
            }
        }
    },
    "/product/updateMainFeatures/{id}": {
        "post": {
            "tags": ["Product"],
            "summary": "Actualizar las principales características de un producto",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "ID del producto",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                }
            ],
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "values": {
                                    "type": "object",
                                    "properties": {
                                        "name": { "type": "string" },
                                        "brand": { "type": "string" },
                                        "model": { "type": "string" },
                                        "gender": { "type": "string" },
                                        "category": { "type": "string" },
                                        "subCategory": { "type": "string" },
                                        "product_key": { "type": "string" }
                                    },
                                    "required": [
                                        "name",
                                        "brand",
                                        "model",
                                        "gender",
                                        "category",
                                        "subCategory",
                                        "product_key"
                                    ]
                                }
                            },
                            "required": ["values"]
                        }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "Características principales actualizadas con éxito",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/Product"
                            }
                        }
                    }
                },
                "500": {
                    "description": "Hubo un error al actualizar las características principales"
                }
            }
        }
    },
    "/updateVariants/{id}": {
        "post": {
            tags: [
                "Product"
            ],
            summary: "Actualizar variantes de un producto",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID del producto",
                    required: true,
                    schema: {
                        type: "string"
                    }
                },

            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                variants: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/VariantProduct"
                                    }
                                }
                            },
                            required: ["variants"]
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
                                $ref: "#/components/schemas/Product"
                            }
                        }
                    }
                },
                500: {
                    "description": "Hubo un error al actualizar las variantes",
                }
            }
        }
    },
    "/product/updateOrder/images/{id}":{
        post:{
            tags: [
                "Product"
            ],
            summary: "Actualizar el orden de las imagenes de un producto",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID del producto",
                    required: true,
                    schema: {
                        type: "string"
                    }
                },

            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                imagesId: {
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                }
                            },
                            required: ["imagesId"]
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
                                $ref: "#/components/schemas/Product"
                            }
                        }
                    }
                },
                500: {
                    "description": "Hubo un error al actualizar el orden de las imagenes",
                }
            }
        }
    },
    "/updateVideo/{id}":{
        put:{
            tags: [
                "Product"
            ],
            summary: "Actualizar el video de un producto",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID del producto",
                    required: true,
                    schema: {
                        type: "string"
                    }
                },

            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                videoId: {
                                    type: "string",
                                    description: "ID del video"
                                },
                                video:{
                                    type:"string",
                                    format:"binary"
                                }
                            },
                            required: ["videoId"]
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
                                $ref: "#/components/schemas/Product"
                            }
                        }
                    }
                },
                500: {
                    "description": "Hubo un error al actualizar el video",
                }
            }
        }
    },
}

export { product };

