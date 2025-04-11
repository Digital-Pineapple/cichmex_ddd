const typeCar = { 
    "/type-car": {
        get: {
            tags: ["TypeCar"],
            summary: "Obtiene todos los tipos de autos",
            description: "Devuelve una lista de todos los tipos de autos registrados.",
            responses: {
                "200": {
                    description: "La solicitud fue exitosa.",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/TypeCar",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                "500": {
                    description: "Error interno del servidor.",
                },
            },
        },
        post: {
            tags: ["TypeCar"],
            summary: "Crear un nuevo tipo de auto",
            description: "Crea un nuevo tipo de auto con los datos proporcionados.",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                name: {
                                    type: "string",
                                    description: "Nombre del tipo de auto.",
                                },
                                typeCar_image: {
                                    type: "string",
                                    format: "binary",
                                    description: "Imagen del tipo de auto (opcional).",
                                },
                            },
                            required: ["name"], // Solo el nombre es obligatorio
                        },
                    },
                },
            },
            responses: {
                "201": {
                    description: "El tipo de auto fue creado exitosamente.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/TypeCar",
                            },
                        },
                    },
                },
                "400": {
                    description: "Solicitud inválida. Verifique los datos enviados.",
                },
                "500": {
                    description: "Error interno del servidor.",
                },
            },
        },
    },
    "/type-car/{id}": {
        get: {
            tags: ["TypeCar"],
            summary: "Obtener un tipo de auto por ID",
            description: "Devuelve un tipo de auto específico según el ID proporcionado.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID del tipo de auto que se desea obtener.",
                    schema: {
                        type: "string",
                    },
                },
            ],
            responses: {
                "200": {
                    description: "La solicitud fue exitosa.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/TypeCar",
                            },
                        },
                    },
                },
                "404": {
                    description: "Tipo de auto no encontrado.",
                },
                "500": {
                    description: "Error interno del servidor.",
                },
            },
        },
        post: {
            tags: ["TypeCar"],
            summary: "Actualizar un tipo de auto",
            description: "Actualiza un tipo de auto existente con los datos proporcionados.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID del tipo de auto que se desea actualizar.",
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
                                name: {
                                    type: "string",
                                    description:
                                        "Nombre del tipo de auto a actualizar.",
                                },
                                typeCar_image: {
                                    type: "string",
                                    format: "binary",
                                    description:
                                        "Imagen del tipo de auto (opcional).",
                                },
                                status:{
                                    type:"boolean",
                                    description:"Estado del tipo de auto"
                                }
                            },
                            required:["name"]
                        },
                    },
                },
            },
            responses: {
                "200": {
                    description:
                        "El tipo de auto fue actualizado exitosamente.",
                    content: {
                        "application/json": {
                            schema: {
                                $ref:"#/components/schemas/TypeCar"
                            }
                        }
                    }
                },
                "400": {
                    description:
                        "Solicitud inválida. Verifique los datos enviados.",
                },
                "404": {
                    description:
                        "Tipo de auto no encontrado. Verifique el ID proporcionado.",
                },
                "500": {
                    description:
                        "Error interno del servidor. Intente nuevamente más tarde.",
                },
            },
        },
        delete: {
            tags: ["TypeCar"],
            summary: "Eliminar un tipo de auto",
            description: "Elimina un tipo de auto existente según el ID proporcionado.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description:
                        "ID del tipo de auto que se desea eliminar.",
                    schema: {
                        type: "string",
                    },
                },
            ],
            responses: {
                "200": {
                    description:
                        "El tipo de auto fue eliminado exitosamente.",
                },
                "404": {
                    description:
                        "Tipo de auto no encontrado. Verifique el ID proporcionado.",
                },
                "500": {
                    description:
                        "Error interno del servidor. Intente nuevamente más tarde.",
                },
            },
        }
    }
};

export { typeCar };