const typeUser = {
    "/type-user": {
        get: {
            tags: ["TypeUser"],
            summary: "Obtiene todos los tipos de usuarios",
            description: "Retrieve all type users",
            parameters: [],
            responses: {
                200: {
                    description: "List of type users",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/TypeUser"
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Internal Server Error"
                }
            }
        },
        post: {
            tags: ["TypeUser"],
            summary: "Crear un nuevo tipo de usuario",
            description: "Create a new type user",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                system: {
                                    type: "array"
                                },
                                roles: {
                                    type: "array"
                                },
                            }
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: "Type user created successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/TypeUser"
                                    },
                                    message: {
                                        type: "string"

                                    }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: "Bad Request"
                },
                500: {
                    description: "Hubo un error al dar de alta"
                }
            }
        }
    },
    "/type-user/{id}": {
        get:{
            tags: ["TypeUser"],
            summary: "Obtiene un tipo de usuario por ID",
            description: "Retrieve a type user by ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID del tipo de usuario",
                    schema: {
                        type: "string"
                    }
                }
            ],
            responses: {
                200: {
                    description: "Type user found",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/TypeUser"
                                    },
                                    message: {
                                        type: "string"
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Hubo un error al consultar la información"
                }
            }
        },
        post:{
            tags: ["TypeUser"],
            summary: "Actualizar un tipo de usuario",
            description: "Update a type user",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID del tipo de usuario",
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
                                name: {
                                    type: "string"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200:{
                    description:"Type user updated successfully",
                    content:{
                        "application/json":{
                            schema:{
                                type:"object",
                                properties:{
                                    message:{
                                        type:"string"
                                    }
                                }
                            }
                        }
                    }
                },
                500:{
                    description:"Hubo un error al editar la información"
                }
            }
        },
        delete: {
            tags: ["TypeUser"],
            summary: "Eliminar un tipo de usuario",
            description: "Delete a type user",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID del tipo de usuario",
                    schema: {
                        type: "string"
                    }
                }
            ],
            responses: {
                200:{
                    description:"Type user deleted successfully",
                    content:{
                        "application/json":{
                            schema:{
                                type:"object",
                                properties:{
                                    data:{
                                        type:"object",
                                        schema:{
                                            $ref:"#/components/schemas/TypeUser"
                                        }
                                    },
                                    message:{
                                        type:"string"
                                    }
                                    
                                }
                            }
                        }
                    }
                },
                500:{
                    description:"Hubo un error al eliminar el tipo de usuario"
                }
            }
        }
    },
    "/type-user/seed": {
        get:{
            tags: ["TypeUser"],
            summary: "Sembrar tipos de usuario",
            description: "Seed type users",
            responses: {
                200:{
                    description:"Type users seeded successfully",
                    content:{
                        "application/json":{
                            schema:{
                                type:"object",
                                properties:{
                                    message:{
                                        type:"string"
                                    }
                                }
                            }
                        }
                    }
                },
                500:{
                    description:"Hubo un error al sembrar los tipos de usuario"
                }
            }
        }
    }
}
export { typeUser }