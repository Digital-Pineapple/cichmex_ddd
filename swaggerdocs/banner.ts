

const banner: any = {
    "/banner/active": {
        get: {
            tags: ["Banners"],
            description: "Get all active banners",
            summary: "Todos los banners activos",
            responses: {
                "200": {
                    description: "Banners retrieved successfully",
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
                                                no_slide: { type: "number", example: 1 },
                                                for_discount: { type: "boolean", example: true },
                                                title: { type: "string", example: "Banner Title" },
                                                description: { type: "string", example: "Banner Description" },
                                                type_event: { type: "string", example: "with-click" },
                                                discount: { type: "string" },
                                                image_slide: { type: "string" },
                                                image_slide_movil: { type: "string" },
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
    "/banner": {
        get: {
            tags: ["Banners"],
            description: "Get all banners",
            summary: "Todos los banners activos o inactivos",
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
                }
            },
        },
    },
    "/banner/{id}": {
        get: {
            tags: ["Banners"],
            description: "Información de un banner(slide)",
            summary: "Información de un banner(slide)",
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
                    description: "Banners retrieved successfully",
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
                }
            },
        },
    },
    "/banner/create/addBanner": {
        post: {
            tags: ["Banners"],
            summary: "Crea un nuevo banner (slide)",
            description: "Esta ruta permite crear un nuevo banner enviando información y archivos.",
            requestBody: {
                required: true,
                content: {
                    "multipart/form-data": {
                        schema: {
                            type: "object",
                            properties: {
                                is_active: { type: "boolean", example: true },
                                no_slide: { type: "number", example: 1 },
                                for_discount: { type: "boolean", example: true },
                                title: { type: "string", example: "Banner Title" },
                                description: { type: "string", example: "Banner Description" },
                                type_event: { type: "string", example: "with-click" },
                                discount: { type: "string", nullable: true },
                                image_slide: { type: "string", format: "binary" },
                                image_slide_movil: { type: "string", format: "binary" }
                            }
                        }
                    }
                }
            },
            responses: {
                "201": {
                    description: "Banner creado exitosamente",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "Banner creado con éxito" },
                                    data: {
                                        type: "object",
                                        properties: {
                                            _id: { type: "string", example: "64f5b4a2c8d3e1e3f8c8e4b2" },
                                            is_active: { type: "boolean", example: true },
                                            no_slide: { type: "number", example: 1 },
                                            for_discount: { type: "boolean", example: true },
                                            title: { type: "string", example: "Banner Title" },
                                            description: { type: "string", example: "Banner Description" },
                                            type_event: { type: "string", example: "with-click" },
                                            discount: { type: "string", nullable: true },
                                            image_slide: { type: "string" },
                                            image_slide_movil: { type: "string" },
                                            createdAt: { type: "string", example: "2023-09-01T12:00:00Z" },
                                            updatedAt: { type: "string", example: "2023-09-01T12:00:00Z" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "500": {
                    description: "Error en la creación",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "Hubo un error al crear el banner" }
                                }
                            }
                        }
                    }
                },
                "400": {
                    description: "Ya existe un banner en esta posicion",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "Ya existe un banner en esta posicion" }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/banner/change_active/{id}": {
        put: {
            tags: ["Banners"],
            summary: "Cambiar estado de activo/inactivo de un banner",
            description: "Esta ruta permite cambiar el estado de un banner a activo o inactivo.",
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
                                is_active: { type: "boolean", example: true }
                            }
                        }
                    }
                }
            },
            responses: {
                "201": {
                    description: "Se editó con éxito",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "Banner creado con éxito" },
                                    data: {
                                        type: "object",
                                        properties: {
                                            _id: { type: "string", example: "64f5b4a2c8d3e1e3f8c8e4b2" },
                                            is_active: { type: "boolean", example: true },
                                            no_slide: { type: "number", example: 1 },
                                            for_discount: { type: "boolean", example: true },
                                            title: { type: "string", example: "Banner Title" },
                                            description: { type: "string", example: "Banner Description" },
                                            type_event: { type: "string", example: "with-click" },
                                            discount: { type: "string", nullable: true },
                                            image_slide: { type: "string" },
                                            image_slide_movil: { type: "string" },
                                            createdAt: { type: "string", example: "2023-09-01T12:00:00Z" },
                                            updatedAt: { type: "string", example: "2023-09-01T12:00:00Z" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "500": {
                    description: "Error en la creación",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "Hubo un error al crear el banner" }
                                }
                            }
                        }
                    }
                },
                "400": {
                    description: "Ya existe un banner en esta posicion",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "Ya existe un banner en esta posicion" }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/banner/update/ok/{id}": {
        put: {
            tags: ["Banners"],
            summary: "Editar un banner (slide)",
            description: "Esta ruta permite editar un banner enviando información y archivos.",
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
                    "multipart/form-data": {
                        schema: {
                            type: "object",
                            properties: {
                                is_active: { type: "boolean", example: true },
                                no_slide: { type: "number", example: 1 },
                                for_discount: { type: "boolean", example: true },
                                title: { type: "string", example: "Banner Title" },
                                description: { type: "string", example: "Banner Description" },
                                type_event: { type: "string", example: "with-click" },
                                discount: { type: "string", nullable: true },
                                image_slide: { type: "string", format: "binary" },
                                image_slide_movil: { type: "string", format: "binary" }
                            }
                        }
                    }
                }
            },
            responses: {
                "201": {
                    description: "Se editó con éxito",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "Banner creado con éxito" },
                                    data: {
                                        type: "object",
                                        properties: {
                                            _id: { type: "string", example: "64f5b4a2c8d3e1e3f8c8e4b2" },
                                            is_active: { type: "boolean", example: true },
                                            no_slide: { type: "number", example: 1 },
                                            for_discount: { type: "boolean", example: true },
                                            title: { type: "string", example: "Banner Title" },
                                            description: { type: "string", example: "Banner Description" },
                                            type_event: { type: "string", example: "with-click" },
                                            discount: { type: "string", nullable: true },
                                            image_slide: { type: "string" },
                                            image_slide_movil: { type: "string" },
                                            createdAt: { type: "string", example: "2023-09-01T12:00:00Z" },
                                            updatedAt: { type: "string", example: "2023-09-01T12:00:00Z" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "500": {
                    description: "Error en la creación",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "Hubo un error al crear el banner" }
                                }
                            }
                        }
                    }
                },
                "400": {
                    description: "Ya existe un banner en esta posicion",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "Ya existe un banner en esta posicion" }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/banner/delete/{id}": {
        delete: {
            tags: ["Banners"],
            summary: "Eliminar un banner (slide)",
            description: "Esta ruta permite eliminar un banner enviando el id.",
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
                    description: "Banner eliminado exitosamente",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "Banner eliminado con éxito" },
                                    data: {
                                        type: "object",
                                        properties: {
                                            _id: { type: "string", example: "64f5b4a2c8d3e1e3f8c8e4b2" },
                                            is_active: { type: "boolean", example: false },
                                            no_slide: { type: "number", example: 1 },
                                            for_discount: { type: "boolean", example: true },
                                            title: { type: "string", example: "Banner Title" },
                                            description: { type: "string", example: "Banner Description" },
                                            type_event: { type: "string", example: "with-click" },
                                            discount: { type: "string", nullable: true },
                                            image_slide: { type: "string" },
                                            image_slide_movil: { type: "string" },
                                            createdAt: { type: "string", example: "2023-09-01T12:00:00Z" },
                                            updatedAt: { type: "string", example: "2023-09-01T12:00:00Z" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "500": {
                    description: "Error en la eliminación",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "Hubo un error al eliminar" }
                                }
                            }
                        }
                    }
                },
            }
        }
    }
}

export { banner };
