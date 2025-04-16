import { request } from "http";
import { format } from "path";

const user = {
    "/user": {
        get: {
            tags: ["User"],
            summary: "Todos los usuarios",
            description: "Get all users",
            responses: {
                200: {
                    description: "Users retrieved successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/User"
                                        }
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
        }
    },
    "/user/phones": {
        get: {
            tags: ["User"],
            summary: "Todos los números de teléfono",
            description: "Get all phones",
            responses: {
                200: {
                    description: "Phones retrieved successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/IPhone"
                                        }
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
        }

    },
    "/user/phone/{id}": {
        get: {
            tags: ["User"],
            summary: "Un número de teléfono",
            description: "Get a phone by ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID del número de teléfono",
                    schema: {
                        type: "string"
                    }
                }
            ],
            responses: {
                200: {
                    description: "Phone retrieved successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/IPhone"
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
        }
    },
    "/user/{id}": {
        get: {
            tags: ["User"],
            summary: "Un usuario",
            description: "Get a user by ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID del usuario",
                    schema: {
                        type: "string"
                    }
                }
            ],
            responses: {
                200: {
                    description: "User retrieved successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/User"
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
        }
    },
    "/user/allInfo/{id}": {
        get: {
            tags: ["User"],
            summary: "Un usuario con toda su información",
            description: "Get a user with all its information by ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID del usuario",
                    schema: {
                        type: "string"
                    }
                }
            ],
            responses: {
                200: {
                    description: "User retrieved successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/User"
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
        }
    },
    "/user/carrier-driver/all": {
        get: {
            tags: ["User"],
            summary: "Todos los conductores",
            description: "Get all drivers",
            responses: {
                200: {
                    description: "Drivers retrieved successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/User"
                                        }
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
        }
    },
    "/user/warehouseman/all": {
        get: {
            tags: ["User"],
            summary: "Todos los almaceneros",
            description: "Get all warehousemen",
            responses: {
                200: {
                    description: "Warehousemen retrieved successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/User"
                                        }
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
        }
    },
    "/user/send-code": {
        post: {
            tags: ["User"],
            summary: "Enviar código de verificación",
            description: "Send verification code",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                phoneNumber: {
                                    type: "string"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Code sent successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string"
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Hubo un error al enviar el código"
                }
            }
        }
    },
    "/user/whatsapp/send-code": {
        post: {
            tags: ["User"],
            summary: "Enviar código de verificación por WhatsApp",
            description: "Send verification code via WhatsApp",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                phoneNumber: {
                                    type: "string"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Code sent successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string"
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Hubo un error al enviar el código"
                }
            }
        }
    },
    "/user/validate/{id}": {
        put: {
            tags: ["User"],
            summary: "Validar usuario",
            description: "Validate user by ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID del usuario",
                    schema: {
                        type: "string"
                    }
                }
            ],
            responses: {
                200: {
                    description: "User validated successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string"
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Hubo un error al validar el usuario"
                }
            }
        }
    },
    "/user/resend-code/{id}": {
        post: {
            tags: ["User"],
            summary: "Reenviar código de verificación",
            description: "Resend verification code",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID del usuario",
                    schema: {
                        type: "string"
                    }
                }
            ],
            responses: {
                200: {
                    description: "Code resent successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string"
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Hubo un error al reenviar el código"
                }
            }
        }
    },
    "/user/update/{id}": {
        post: {
            tags: ["User"],
            summary: "Actualizar usuario",
            description: "Update user by ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID del usuario",
                    schema: {
                        type: "string"
                    }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "multipart/form-data": {
                        schema: {
                            type: "object",
                            properties: {
                                fullname: {
                                    type: "string"
                                },
                                type_user: {
                                    type: "string"
                                },
                                profile_image: {
                                    type: "string",
                                    format  : "binary"  
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "User updated successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string"
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Hubo un error al actualizar el usuario"
                }
            }
        }
    },
    "/user/verify-phone/{id}": {
        post: {
            tags: ["User"],
            summary: "Verificar número de teléfono",
            description: "Verify phone number by ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID del usuario",
                    schema: {
                        type: "string"
                    }
                }
            ],
            responses: {
                200: {
                    description: "Phone verified successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string"
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Hubo un error al verificar el número de teléfono"
                }
            }
        }
    },
    "/user/verify-email/{id}": {
        post: {
            tags: ["User"],
            summary: "Verificar correo electrónico",
            description: "Verify email by ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID del usuario",
                    schema: {
                        type: "string"
                    }
                }
            ],
            responses: {
                200: {
                    description: "Email verified successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string"
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Hubo un error al verificar el correo electrónico"
                }
            }
        }
    },
    "/user/registerbyPhone": {
        post: {
            tags: ["User"],
            summary: "Registrar usuario por teléfono",
            description: "Register user by phone",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                fullname: {
                                    type: "string"
                                },
                                email:{
                                    type: "string"
                                },
                                password:{
                                    type: "string"
                                },
                                phone_id:{
                                    type: "string"
                                },
                                system:{
                                    type: "string"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "User registered successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string"
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Hubo un error al registrar el usuario"
                }
            }
        }
    },
    "/user/registerPartnernyPhone": {
        post: {
            tags: ["User"],
            summary: "Registrar usuario por teléfono",
            description: "Register user by phone",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                fullname: {
                                    type: "string"
                                },
                                email:{
                                    type: "string"
                                },
                                password:{
                                    type: "string"
                                },
                                phone_id:{
                                    type: "string"
                                },
                                system:{
                                    type: "string"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "User registered successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string"
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Hubo un error al registrar el usuario"
                }
            }
        }
    },
    "/user/loginbyPhone": {
        post: {
            tags: ["User"],
            summary: "Iniciar sesión por teléfono",
            description: "Login user by phone",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                password: {
                                    type: "string"
                                },
                                phone_number:{
                                    type: "number"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "User logged in successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string"
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Hubo un error al iniciar sesión"
                }
            }
        }
    },
    "/user/loginByPhonePartner": {
        post: {
            tags: ["User"],
            summary: "Iniciar sesión por teléfono",
            description: "Login user by phone",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                password: {
                                    type: "string"
                                },
                                phone_number:{
                                    type: "number"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "User logged in successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string"
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Hubo un error al iniciar sesión"
                }
            }
        }
    },
    "/user/collection-point/update/{id}": {
        post: {
            tags: ["User"],
            summary: "Actualizar punto de recolección",
            description: "Update collection point by ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID del usuario",
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
                                store: {
                                    type: "string"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Collection point updated successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string"
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Hubo un error al actualizar el punto de recolección"
                }
            }
        }
    },
    "/user/carrier-driver": {
        post: {
            tags: ["User"],
            summary: "Crear un conductor",
            description: "Create a driver",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            allOf: [
                                { $ref: "#/components/schemas/User" }
                            ]
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Driver created successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string"
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Hubo un error al crear el conductor"
                }
            }
        }
    },
    "/user/warehouseman": {
        post: {
            tags: ["User"],
            summary: "Crear un almaceista",
            description: "Create a warehouseman",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            allOf: [
                                { $ref: "#/components/schemas/User" }
                            ]
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Warehouseman created successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string"
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Hubo un error al crear el almacenero"
                }
            }
        }
    },
    "/user/carrier-driver/update/{id}": {
        post: {
            tags: ["User"],
            summary: "Actualizar un conductor",
            description: "Update a driver by ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID del conductor",
                    schema: {
                        type: "string"
                    }
                }
            ],
            responses: {
                200: {
                    description: "Driver updated successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string"
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Hubo un error al actualizar el conductor"
                }
            }
        }
    },
    "/user/phone-delete/{id}": {
        delete: {
            tags: ["User"],
            summary: "Eliminar un número de teléfono",
            description: "Delete a phone by ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID del número de teléfono",
                    schema: {
                        type: "string"
                    }
                }
            ],
            responses: {
                200: {
                    description: "Phone deleted successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string"
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Hubo un error al eliminar el número de teléfono"
                }
            }
        }
    },
    "/user/phone-delete-1/{id}": {
        delete: {
            tags: ["User"],
            summary: "Eliminar un número de teléfono",
            description: "Delete a phone by ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID del número de teléfono",
                    schema: {
                        type: "string"
                    }
                }
            ],
            responses: {
                200: {
                    description: "Phone deleted successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string"
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Hubo un error al eliminar el número de teléfono"
                }
            }
        }
    },
    "/user/delete-user/{id}": {
        delete: {
            tags: ["User"],
            summary: "Eliminar un usuario",
            description: "Delete a user by ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID del usuario",
                    schema: {
                        type: "string"
                    }
                }
            ],
            responses: {
                200: {
                    description: "User deleted successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string"
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Hubo un error al eliminar el usuario"
                }
            }
        }
    },
    "/user/create/address": {
        post: {
            tags: ["User"],
            summary: "Crear una dirección",
            description: "Create an address",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            allOf: [
                                { $ref: "#/components/schemas/AddressEntity" }
                            ]
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Address created successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string"
                                    },
                                    data:{
                                        $ref: "#/components/schemas/AddressEntity"
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Hubo un error al crear la dirección"
                }
            }
        }
    },
    "/user/update/address/{id}": {
        put: {
            tags: ["User"],
            summary: "Actualizar una dirección",
            description: "Update an address by ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID de la dirección",
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
                            allOf: [
                                { $ref: "#/components/schemas/AddressEntity" }
                            ]
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Address updated successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string"
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Hubo un error al actualizar la dirección"
                }
            }
        }
    },
    "/user/delete/address/{id}": {
        delete: {
            tags: ["User"],
            summary: "Eliminar una dirección",
            description: "Delete an address by ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID de la dirección",
                    schema: {
                        type: "string"
                    }
                }
            ],
            responses: {
                200: {
                    description: "Address deleted successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string"
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Hubo un error al eliminar la dirección"
                }
            }
        }
    },
    "/user/warehouseman/update/{id}": {
        put: {
            tags: ["User"],
            summary: "Actualizar un almacenista",
            description: "Update a warehouseman by ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID del almacenista",
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
                            properties:{
                                values:{
                                    type: "object",
                                    allOf: [
                                        { $ref: "#/components/schemas/User" }
                                    ]
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Warehouseman updated successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string"
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Hubo un error al actualizar el almacenero"
                }
            }
        }
    },
    "/user/adresses/{id}": {
        get: {
            tags: ["User"],
            summary: "Obtener todas las direcciones de un usuario",
            description: "Get all addresses of a user by ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID del usuario",
                    schema: {
                        type: "string"
                    }
                }
            ],
            responses: {
                200: {
                    description: "Addresses retrieved successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/Address"
                                        }
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
        }
    },
    "/user/carrier-driver/{id}": {
        delete: {
            tags: ["User"],
            summary: "Eliminar un conductor",
            description: "Delete a driver by ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID del conductor",
                    schema: {
                        type: "string"
                    }
                }
            ],
            responses: {
                200: {
                    description: "Driver deleted successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string"
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Hubo un error al eliminar el conductor"
                }
            }
        }
    }


}

export { user };


