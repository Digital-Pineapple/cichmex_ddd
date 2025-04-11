import { param } from "express-validator";

const taxInfo = {
    "/tax-info": {
        "get": {
            "tags": ["TaxInfo"],
            "summary": "Obtiene todos los tax info",
            "description": "Devuelve una lista de toda la información fiscal registrada.",
            "operationId": "getAllTaxInfo",
            "parameters": [],
            "responses": {
                "200": {
                    "description": "Lista de información fiscal obtenida exitosamente.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/TaxInfo"
                            }
                        }
                    }
                },
                "500": {
                    "description": "Hubo un error al consultar la información."
                }
            }
        },
        "post": {
            "tags": ["TaxInfo"],
            "summary": "Crear tax info",
            "description": "Crea una nueva entrada de información fiscal.",
            "operationId": "createTaxInfo",
            "parameters": [],
            "requestBody": {
                "description": "Objeto que contiene la información fiscal a registrar.",
                "required": true,
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "values": {
                                    "$ref": "#/components/schemas/TaxInfo"
                                },
                            }
                        }
                    }
                }
            },
            "responses": {
                "201": {
                    "description": "Información fiscal creada exitosamente.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "data": {
                                        "$ref": "#/components/schemas/TaxInfo"
                                    },
                                    "message": {
                                        "type": "string",
                                        "example": "Se guardó la dirección fiscal."
                                    }
                                }
                            }
                        }
                    }
                },
                "400": {
                    "description": "Solicitud inválida. Verifique los datos enviados."
                },
                "500": {
                    "description": "Error interno del servidor."
                }
            }
        }
    },
    "/tax-info/user": {
        "get": {
            "tags": ["TaxInfo"],
            "summary": "Obtiene la información fiscal del usuario autenticado",
            "description": "Devuelve la información fiscal asociada al usuario autenticado.",
            "operationId": "getMyTaxInfo",
            "parameters": [],
            "responses": {
                "200": {
                    "description": "Información fiscal del usuario obtenida exitosamente.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/TaxInfo"
                            }
                        }
                    }
                },
                "500": {
                    "description": "Hubo un error al consultar la información."
                }
            }
        }
    },
    "/tax-info/{id}": {
        "post": {
            "tags": ["TaxInfo"],
            "summary": "Actualizar tax info",
            "description": "Actualiza la información fiscal existente.",
            "operationId": "updateTaxInfo",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "required": true,
                    "description": "ID de la información fiscal a actualizar.",
                    "schema": {
                        "type": "string"
                    }
                }
            ],
            "requestBody": {
                "description": "Objeto que contiene los nuevos datos de la información fiscal.",
                "required": true,
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/TaxInfo"
                        }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "Información fiscal actualizada exitosamente.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/TaxInfo"
                            }
                        }
                    }
                },
                "400": {
                    "description": "Solicitud inválida. Verifique los datos enviados."
                },
                "500": {
                    "description": "Error interno del servidor."
                }
            }
        },
        delete:{
            tags: ["TaxInfo"],
            summary: "Eliminar tax info",
            description: "Elimina una entrada de información fiscal existente.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID de la información fiscal a eliminar.",
                    schema: {
                        type: "string"
                    }
                }
            ],
            responses: {
                "200": {
                    "description": "Información fiscal eliminada exitosamente.",
                    "content": {
                        "application/json": {
                            data:{
                                "$ref": "#/components/schemas/TaxInfo"
                            },
                            message:{
                                type: "string",
                                example: "Se eliminó correctamente"
                            }
                        }
                    }
                },
                "400": {
                    "description": "Solicitud inválida. Verifique los datos enviados."
                },
                "500": {
                    "description": "Error interno del servidor."
                }
            }

        }
    },
    "/tax-info/create-invoice": {
        "post": {
            "tags": ["TaxInfo"],
            "summary": "Crear factura",
            "description": "Genera una factura utilizando la información fiscal y el ID del pedido.",
            "operationId": "createInvoice",
            "parameters": [],
            "requestBody": {
                "description": "Objeto que contiene la información necesaria para crear la factura.",
                "required": true,
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "data": {
                                    "$ref": "#/components/schemas/TaxInfo"
                                },
                                "order_id": {
                                    "type": "string",
                                    "description": "ID del pedido para el cual se generará la factura."
                                }
                            }
                        }   
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "Factura generada exitosamente.",
                    "content": {
                        "application/json": {
                            "schema": {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "object",
                                        properties: {
                                            id: {
                                                type: "string",
                                                description: "ID de la factura generada."
                                            },
                                            url: {
                                                type: "string",
                                                description: "URL para acceder a la factura generada."
                                            }
                                        }
                                    },
                                    message: {
                                        type: "string",
                                        example: "Factura creada exitosamente."
                                    }
                                }
                            }
                        }
                    }
                },
                "400": {
                    "description": "Solicitud inválida. Verifique los datos enviados."
                },
                "500": {
                    "description": "Error interno del servidor."
                }
            }
        }
    }
    
};

export { taxInfo };