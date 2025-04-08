import e from "express";
import { schedule } from "node-cron";
import { ref } from "pdfkit";

const region = { 
"/region": {
    get:{
        tags: ["Region"],
        summary: "Todas las regiones",
        description: "Get all regions",
        parameters: [],
        responses: {
            200: {
                description: "List of regions",
                content: {
                    "application/json": {
                        schema: {
                            type: "array",
                            items: {
                                $ref: "#/components/schemas/Region"
                            }
                        }
                    }
                }
            }
        }
    },
    post:{
        tags: ["Region"],
        summary: "Crear region",
        description: "Create a region",
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    "schema": {
                        "type": "object",
                        "properties": {
                          "values": {
                            "$ref": "#/components/schemas/Region"
                          }
                        },
                        "required": ["values"]
                      }
                }
            }
        },
        responses: {
            201: {
                description: "Region created",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/Region"
                        }
                    }
                }
            },
            400: {
                description: "Invalid input"
            }
        }
    }
},
"/region/{id}": {
    get:{
        tags: ["Region"],
        summary: "Una region",
        description: "Get one region",
        parameters: [
            {
                name: "id",
                in: "path",
                required: true,
                description: "Id de la region",
                schema: {
                    type: "string"
                }
            }
        ],
        responses: {
            200: {
                description: "Region found",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/Region"
                        }
                    }
                }
            },
            404: {
                description: "Region not found"
            }
        }
    },
    delete:{
        tags: ["Region"],
        summary: "Eliminar region",
        description: "Delete a region",
        parameters: [
            {
                name: "id",
                in: "path",
                required: true,
                description: "Id de la region",
                schema: {
                    type: "string",
                    example: "1234567890"
                }
            }
        ],
        responses: {
            204: {
                description: "Region deleted"
            },
            404: {
                description: "Region not found"
            }
        },
    

    }
},
"/region/update/{id}": {
    put:{
        tags: ["Region"],
        summary: "Actualizar region",
        description: "Update a region",
        parameters: [
            {
                name: "id",
                in: "path",
                required: true,
                description: "Id de la region",
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
                        $ref: "#/components/schemas/Region"
                    }
                }
            }
        },
        responses: {
            200: {
                description: "Region updated",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/Region"
                        }
                    }
                }
            },
            400: {
                description: "Invalid input"
            }
        }
    }
},



}

export {region}