const warehouse = {
    "/warehouse/all_zones": {
        get: {
            tags: ["Warehouse"],
            summary: "Obtener todas las zonas",
            description: "Obtiene todas las zonas del almacén.",
            responses: {
                "200": {
                    description: "Zonas obtenidas exitosamente.",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/Zone",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                403: {
                    description: "No tienes permisos para acceder a este recurso",
                },
                "500": {
                    description: "Hubo un error al consultar la información",
                },
            },
        }
    },
    "/warehouse/all_aisles": {
        get: {
            tags: ["Warehouse"],
            summary: "Obtener todos los pasillos",
            description: "Obtiene todos los pasillos del almacén.",
            responses: {
                "200": {
                    description: "Pasillos obtenidos exitosamente.",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/Aisle",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                403: {
                    description: "No tienes permisos para acceder a este recurso",
                },
                "500": {
                    description: "Hubo un error al consultar la información",
                },
            },
        }
    },
    "/warehouse/all_sections": {
        get: {
            tags: ["Warehouse"],
            summary: "Obtener todas las secciones",
            description: "Obtiene todas las secciones del almacén.",
            responses: {
                "200": {
                    description: "Secciones obtenidas exitosamente.",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/Section",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                403: {
                    description: "No tienes permisos para acceder a este recurso",
                },
                "500": {
                    description: "Hubo un error al consultar la información",
                },
            },
        }
    },
    "/warehouse/aisle/{id}": {
        get: {
            tags: ["Warehouse"],
            summary: "Obtener un pasillo por ID",
            description: "Obtiene un pasillo específico del almacén.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID del pasillo a obtener",
                    schema: {
                        type: "string",
                    },
                },
            ],
            responses: {
                "200": {
                    description: "Pasillo obtenido exitosamente.",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/Aisle",
                                    },
                                },
                            },
                        },
                    },
                },
                403: {
                    description: "No tienes permisos para acceder a este recurso",
                },
                "500": {
                    description: "Hubo un error al consultar la información",
                },
            },
        }
    },
    "/warehouse/section/{id}": {
        get: {
            tags: ["Warehouse"],
            summary: "Obtener una sección por ID",
            description: "Obtiene una sección específica del almacén.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID de la sección a obtener",
                    schema: {
                        type: "string",
                    },
                },
            ],
            responses: {
                "200": {
                    description: "Sección obtenida exitosamente.",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/Section",
                                    },
                                },
                            },
                        },
                    },
                },
                403: {
                    description: "No tienes permisos para acceder a este recurso",
                },
                "500": {
                    description: "Hubo un error al consultar la información",
                },
            },
        }
    },
    "/warehouse/print_section_code/{id}": {
        get: {
            tags: ["Warehouse"],
            summary: "Imprimir código de sección",
            description: "Genera un PDF con el código de barras de la sección.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID de la sección a imprimir",
                    schema: {
                        type: "string",
                    },
                },
            ],
            responses: {
                "200": {
                    description: "PDF generado exitosamente.",
                },
                403: {
                    description: "No tienes permisos para acceder a este recurso",
                },
                "500": {
                    description: "Hubo un error al generar el PDF",
                },
            },
        }
    },
    "/warehouse/search_product_section/{id}": {
        get: {
            tags: ["Warehouse"],
            summary: "Buscar productos en una sección",
            description: "Busca productos en una sección específica del almacén.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID de la sección a buscar",
                    schema: {
                        type: "string",
                    },
                },
            ],
            responses: {
                "200": {
                    description: "Productos encontrados exitosamente.",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/Product",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                403: {
                    description: "No tienes permisos para acceder a este recurso",
                },
                "500": {
                    description: "Hubo un error al consultar la información",
                },
            },
        }
    },
    "/warehouse/add_zone": {
        post: {
            tags: ["Warehouse"],
            summary: "Agregar una nueva zona",
            description: "Agrega una nueva zona al almacén.",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/Zone",
                        },
                    },
                },
            },
            responses: {
                "201": {
                    description: "Zona creada exitosamente.",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/Zone",
                                    },
                                },
                            },
                        },
                    },
                },
                403: {
                    description: "No tienes permisos para acceder a este recurso",
                },
                "500": {
                    description: "Hubo un error al crear la zona",
                },
            },
        }
    },
    "/warehouse/add_aisle": {
        post: {
            tags: ["Warehouse"],
            summary: "Agregar un nuevo pasillo",
            description: "Agrega un nuevo pasillo al almacén.",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/Aisle",
                        },
                    },
                },
            },
            responses: {
                "201": {
                    description: "Pasillo creado exitosamente.",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/Aisle",
                                    },
                                },
                            },
                        },
                    },
                },
                403: {
                    description: "No tienes permisos para acceder a este recurso",
                },
                "500": {
                    description: "Hubo un error al crear el pasillo",
                },
            },
        }
    },
    "/warehouse/add_section": {
        post: {
            tags: ["Warehouse"],
            summary: "Agregar una nueva sección",
            description: "Agrega una nueva sección al almacén.",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/Section",
                        },
                    },
                },
            },
            responses: {
                "201": {
                    description: "Sección creada exitosamente.",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/Section",
                                    },
                                },
                            },
                        },
                    },
                },
                403: {
                    description: "No tienes permisos para acceder a este recurso",
                },
                "500": {
                    description: "Hubo un error al crear la sección",
                },
            },
        }
    },
    "/warehouse/add_multiple_aisles": {
        post: {
            tags: ["Warehouse"],
            summary: "Agregar múltiples pasillos",
            description: "Agrega múltiples pasillos al almacén.",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "array",
                            items: {
                                $ref: "#/components/schemas/Aisle",
                            },
                        },
                    },
                },
            },
            responses: {
                "201": {
                    description: "Pasillos creados exitosamente.",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/Aisle",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                403: {
                    description: "No tienes permisos para acceder a este recurso",
                },
                "500": {
                    description: "Hubo un error al crear los pasillos",
                },
            },
        }
    },
    "/warehouse/add_multiple_sections": {
        post: {
            tags: ["Warehouse"],
            summary: "Agregar múltiples secciones",
            description: "Agrega múltiples secciones al almacén.",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "array",
                            items: {
                                $ref: "#/components/schemas/Section",
                            },
                        },
                    },
                },
            },
            responses: {
                "201": {
                    description: "Secciones creadas exitosamente.",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/Section",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                403: {
                    description: "No tienes permisos para acceder a este recurso",
                },
                "500": {
                    description: "Hubo un error al crear las secciones",
                },
            },
        }
    },
    "/warehouse/section/add_multiple_products": {
        post: {
            tags: ["Warehouse"],
            summary: "Agregar múltiples productos a una sección",
            description: "Agrega múltiples productos a una sección específica del almacén.",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "array",
                            items: {
                                $ref: "#/components/schemas/Product",
                            },
                        },
                    },
                },
            },
            responses: {
                "201": {
                    description: "Productos agregados exitosamente.",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/Product",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                403: {
                    description: "No tienes permisos para acceder a este recurso",
                },
                "500": {
                    description: "Hubo un error al agregar los productos",
                },
            },
        }
    },
    "/warehouse/section/add_product": {
        post: {
            tags: ["Warehouse"],
            summary: "Agregar un producto a una sección",
            description: "Agrega un producto a una sección específica del almacén.",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                section: { type: "string" },
                                product: { type: "object" , properties:{
                                    _id: { type: "string" },
                                    type: { type: "string" },
                                } },
                                quantity: { type: "integer" },
                            }
                        },
                    },
                },
            },
            responses: {
                "201": {
                    description: "Producto agregado exitosamente.",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/Product",
                                    },
                                },
                            },
                        },
                    },
                },
                403: {
                    description: "No tienes permisos para acceder a este recurso",
                },
                "500": {
                    description: "Hubo un error al agregar el producto",
                },
            },
        }
    },
    "/warehouse/section/update_stock": {
        patch: {
            tags: ["Warehouse"],
            summary: "Actualizar stock de un producto en una sección",
            description: "Actualiza el stock de un producto en una sección específica del almacén.",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                section: { type: "string" },
                                product: { type: "object" , properties:{
                                    _id: { type: "string" },
                                    type: { type: "string" },
                                } },
                                quantity: { type: "integer" },
                            }
                        },
                    },
                },
            },
            responses: {
                "200": {
                    description: "Stock actualizado exitosamente.",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/Product",
                                    },
                                },
                            },
                        },
                    },
                },
                403: {
                    description: "No tienes permisos para acceder a este recurso",
                },
                "500": {
                    description: "Hubo un error al actualizar el stock",
                },
            },
        }
    },
    "/warehouse/update_zone/{id}": {
        post: {
            tags: ["Warehouse"],
            summary: "Actualizar una zona",
            description: "Actualiza una zona específica del almacén.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID de la zona a actualizar",
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
                            $ref: "#/components/schemas/Zone",
                        },
                    },
                },
            },
            responses: {
                "200": {
                    description: "Zona actualizada exitosamente.",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/Zone",
                                    },
                                },
                            },
                        },
                    },
                },
                403: {
                    description: "No tienes permisos para acceder a este recurso",
                },
                "500": {
                    description: "Hubo un error al actualizar la zona",
                },
            },
        }
    },
    "/warehouse/update_aisle/{id}": {
        post: {
            tags: ["Warehouse"],
            summary: "Actualizar un pasillo",
            description: "Actualiza un pasillo específico del almacén.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID del pasillo a actualizar",
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
                            $ref: "#/components/schemas/Aisle",
                        },
                    },
                },
            },
            responses: {
                "200": {
                    description: "Pasillo actualizado exitosamente.",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/Aisle",
                                    },
                                },
                            },
                        },
                    },
                },
                403: {
                    description: "No tienes permisos para acceder a este recurso",
                },
                "500": {
                    description: "Hubo un error al actualizar el pasillo",
                },
            },
        }
    },
    "/warehouse/update_section/{id}": {
        post: {
            tags: ["Warehouse"],
            summary: "Actualizar una sección",
            description: "Actualiza una sección específica del almacén.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID de la sección a actualizar",
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
                            $ref: "#/components/schemas/Section",
                        },
                    },
                },
            },
            responses: {
                "200": {
                    description: "Sección actualizada exitosamente.",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/Section",
                                    },
                                },
                            },
                        },
                    },
                },
                403: {
                    description: "No tienes permisos para acceder a este recurso",
                },
                "500": {
                    description: "Hubo un error al actualizar la sección",
                },
            },
        }
    },
    "/warehouse/delete_zone/{id}": {
        delete: {
            tags: ["Warehouse"],
            summary: "Eliminar una zona",
            description: "Elimina una zona específica del almacén.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID de la zona a eliminar",
                    schema: {
                        type: "string",
                    },
                },
            ],
            responses: {
                "200": {
                    description: "Zona eliminada exitosamente.",
                },
                403: {
                    description: "No tienes permisos para acceder a este recurso",
                },
                "500": {
                    description: "Hubo un error al eliminar la zona",
                },
            },
        }
    },
    "/warehouse/delete_aisle/{id}": {
        delete: {
            tags: ["Warehouse"],
            summary: "Eliminar un pasillo",
            description: "Elimina un pasillo específico del almacén.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID del pasillo a eliminar",
                    schema: {
                        type: "string",
                    },
                },
            ],
            responses: {
                "200": {
                    description: "Pasillo eliminado exitosamente.",
                },
                403: {
                    description: "No tienes permisos para acceder a este recurso",
                },
                "500": {
                    description: "Hubo un error al eliminar el pasillo",
                },
            },
        }
    },
    "/warehouse/delete_section/{id}": {
        delete:{
            tags: ["Warehouse"],
            summary: "Eliminar una sección",
            description: "Elimina una sección específica del almacén.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID de la sección a eliminar",
                    schema: {
                        type: "string",
                    },
                },
            ],
            responses: {
                "200": {
                    description: "Sección eliminada exitosamente.",
                },
                403: {
                    description: "No tienes permisos para acceder a este recurso",
                },
                "500": {
                    description: "Hubo un error al eliminar la sección",
                },
            }
        }
    }
}
export { warehouse }