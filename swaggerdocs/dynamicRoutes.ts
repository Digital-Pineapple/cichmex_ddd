
const dynamicRoutes: any = {
    "/dynamic-route/all": {
        get: {
            tags: ["Dynamic Routes"],
            description: "Obtener todas las rutas dinámicas",
            summary: "Obtener todas las rutas dinámicas",
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
                                                id: { type: "string", example: "1234567890" },
                                                name: { type: "string", example: "Nombre de la ruta" },
                                                path: { type: "string", example: "/ruta" },
                                                component: { type: "number", example: 10 },
                                                authRequired: { type: "boolean", example: true },
                                                rolesAllowed: {
                                                    type: "array",
                                                    items: {
                                                        type: "string",
                                                        example: "SUPER-ADMIN",
                                                        description: "Roles permitidos para acceder a la ruta",
                                                    }
                                                },
                                                status: { type: "boolean", example: true },
                                                system: { type: "string", example: "CICHMEX" },
                                                createdAt: { type: "string", example: "2023-10-01T00:00:00Z" },
                                                updatedAt: { type: "string", example: "2023-10-01T00:00:00Z" },
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
            }
        },
    },
    "/dynamic-route/{id}": {
        get: {
            tags: ["Dynamic Routes"],
            description: "Obtener ruta dinámica",
            summary: "Obtener ruta dinámica",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID de la ruta dinámica",
                    schema: {
                        type: "string",
                        example: "1234567890",
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
                                    id: { type: "string", example: "1234567890" },
                                    name: { type: "string", example: "Nombre de la ruta" },
                                    path: { type: "string", example: "/ruta" },
                                    component: { type: "number", example: 10 },
                                    authRequired: { type: "boolean", example: true },
                                    rolesAllowed: {
                                        type: "array",
                                        items: {
                                            type: "string",
                                            example: "SUPER-ADMIN",
                                            description: "Roles permitidos para acceder a la ruta",
                                        }
                                    },
                                    status: { type: "boolean", example: true },
                                    system: { type: "string", example: "CICHMEX" },
                                    createdAt: { type: "string", example: "2023-10-01T00:00:00Z" },
                                    updatedAt: { type: "string", example: "2023-10-01T00:00:00Z" },
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
            }
        },
        delete:{
            tags: ["Dynamic Routes"],
            description: "Eliminar ruta dinámica",
            summary: "Eliminar ruta dinámica",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID de la ruta dinámica",
                    schema: {
                        type: "string",
                        example: "1234567890",
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
                                    message: { type: "string", example: "Ruta eliminada con éxito" },
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
                                    message: { type: "string", example: "Hubo un error al eliminar la ruta" },
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
    "/dynamic-route/links/all": {
        get: {
            tags: ["Dynamic Routes"],
            description: "Obtener rutas dinámicas del usuario",
            summary: "Obtener rutas dinámicas del usuario",
            parameters: [
                {
                    name: "system",
                    in: "query",
                    required: true,
                    description: "Sistema al que pertenece LA RUTA",
                    schema: {
                        type: "array",
                        items: {
                            type: "string",
                        example: "Admin",
                        description: "Sistema al que pertenece LA RUTA",
                        },
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
                                                id: { type: "string", example: "1234567890" },
                                                name: { type: "string", example: "Nombre de la ruta" },
                                                path: { type: "string", example: "/ruta" },
                                                component: { type: "number", example: 10 },
                                                authRequired: { type: "boolean", example: true },
                                                rolesAllowed: {
                                                    type: "array",
                                                    items: {
                                                        type: "string",
                                                        example: "SUPER-ADMIN",
                                                        description: "Roles permitidos para acceder a la ruta",
                                                    }
                                                },
                                                status: { type: "boolean", example: true },
                                                system: { type: "string", example: "CICHMEX" },
                                                createdAt: { type: "string", example: "2023-10-01T00:00:00Z" },
                                                updatedAt: { type: "string", example: "2023-10-01T00:00:00Z" },
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
                },
                "404": {
                    description: "Error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "No se encontaron rutas" },
                                },
                            },
                        },
                    },
                }
            }
        },
    },
    "/dynamic-route": {
        post: {
            tags: ["Dynamic Routes"],
            description: "Crear ruta dinámica",
            summary: "Crear ruta dinámica",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                values: { type: "object",
                                    properties:{
                                        uuid:{ type: "string", example: "1234567890" },
                                        name: { type: "string", example: "Nombre de la ruta" },
                                        path    : { type: "string", example: "/ruta" },
                                        component: { type: "number", example: 10 },
                                        authRequired: { type: "boolean", example: true },
                                        rolesAllowed: {
                                            type: "array",
                                            items: {
                                                type: "string",
                                                example: "SUPER-ADMIN",
                                                description: "Roles permitidos para acceder a la ruta",
                                            }
                                        },
                                        redirectTo: { type: "string", example: "/ruta" },
                                        system: { type: "string", example: "Admin" },
                                        status: { type: "boolean", example: true },
                                        createdAt: { type: "string", example: "2023-10-01T00:00:00Z" },
                                        updatedAt: { type: "string", example: "2023-10-01T00:00:00Z" },
                                    }
                                 },
                            },
                        },
                    },
                }
                
            },
            responses: {
                "200": {
                    description: "Ruta creada con éxito",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    id: { type: "string", example: "1234567890" },
                                    name: { type: "string", example: "Nombre de la ruta" },
                                    path: { type: "string", example: "/ruta" },
                                    component: { type: "number", example: 10 },
                                    authRequired: { type: "boolean", example: true },
                                    rolesAllowed: {
                                        type: "array",
                                        items: {
                                            type: "string",
                                            example: "SUPER-ADMIN",
                                            description: "Roles permitidos para acceder a la ruta",
                                        }
                                    },
                                    status: { type: "boolean", example: true },
                                    system: { type: "string", example: "CICHMEX" },
                                    createdAt: { type: "string", example: "2023-10-01T00:00:00Z" },
                                    updatedAt: { type: "string", example: "2023-10-01T00:00:00Z" },
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
                },
            }
        },
    },
    "/dynamic-route/update/{id}": {
        put: {
            tags: ["Dynamic Routes"],
            description: "Editar ruta dinámica",
            summary: "Editar ruta dinámica",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID de la ruta dinámica",
                    schema: {
                        type: "string",
                        example: "1234567890",
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
                                values: { type: "object",
                                    properties:{
                                        uuid:{ type: "string", example: "1234567890" },
                                        name: { type: "string", example: "Nombre de la ruta" },
                                        path    : { type: "string", example: "/ruta" },
                                        component: { type: "number", example: 10 },
                                        authRequired: { type: "boolean", example: true },
                                        rolesAllowed: {
                                            type: "array",
                                            items: {
                                                type: "string",
                                                example: "SUPER-ADMIN",
                                                description: "Roles permitidos para acceder a la ruta",
                                            }
                                        },
                                        redirectTo: { type: "string", example: "/ruta" },
                                        system: { type: "string", example: "CICHMEX" },
                                        status: { type: "boolean", example: true },
                                        createdAt: { type: "string", example: "2023-10-01T00:00:00Z" },
                                        updatedAt: { type: "string", example: "2023-10-01T00:00:00Z" },
                                    }
                                 },
                            },
                        },
                    },
                }
                
            },
            responses: {
                "200": {
                    description: "Se editó con éxito",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    id: { type: "string", example: "1234567890" },
                                    name: { type: "string", example: "Nombre de la ruta" },
                                    path: { type: "string", example: "/ruta" },
                                    component: { type: "number", example: 10 },
                                    authRequired: { type: "boolean", example: true },
                                    rolesAllowed: {
                                        type: "array",
                                        items: {
                                            type: "string",
                                            example: "SUPER-ADMIN",
                                            description: "Roles permitidos para acceder a la ruta",
                                        }
                                    },
                                    status: { type: "boolean", example: true },
                                    system: { type: "string", example: "CICHMEX" },
                                    createdAt: { type: "string", example: "2023-10-01T00:00:00Z" },
                                    updatedAt: { type: "string", example: "2023-10-01T00:00:00Z" },
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
                                    message: { type: "string", example: "Hubo un error al editar" },
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
                },
            }
        },
    },
  

}

export { dynamicRoutes };
