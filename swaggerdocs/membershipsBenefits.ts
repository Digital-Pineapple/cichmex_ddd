import { response } from "express";
import { request } from "http";

const membershipsBenefits: any = {
  "/membership-benefits": {
    get: {
      tags: ["Memberships Benefits"],
      summary: "Todos los beneficios de membresías",
      description: "Todos los beneficios de membresías",
      responses: {
        200: {
          description: "",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MembershipBenefits"
              }
            }
          }
        },
        500: {
          description: "Internal server error"
        }
      }
    },
    post: {
      tags: ["Memberships Benefits"],
      summary: "Crear beneficio de membresía",
      description: "Crear beneficio de membresía",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                membership_id: {
                  type: "string",
                  description: "ID de la membresía",
                },
                service_id: {
                  type: "string",
                  description: "ID del servicio"
                },
                client_id: {
                  type: "string",
                  description: "ID del cliente"
                },
                quantity: {
                  type: "number",
                  description: "Cantidad de beneficios"
                },
                start_date: {
                  type: "string",
                  format: "date-time",
                  description: "Fecha de inicio del beneficio"
                },
                end_date: {
                  type: "string",
                  format: "date-time",
                  description: "Fecha de fin del beneficio"
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
                $ref: "#/components/schemas/MembershipBenefits"
              }
            }
          }
        },
        500: {
          description: "Hubo un error al crear"
        }
      }
    }

  },
  "/membership-benefits/{id}": {
    get: {
      tags: ["Memberships Benefits"],
      summary: "Obner un beneficio de membresía por id",
      description: "Obtener un beneficio de membresía por id",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID del beneficio de membresía",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          description: "",
          content: {
            "application/json": {

              schema: {
                $ref: "#/components/schemas/MembershipBenefits"
              }
            }
          }
        },
        500: {
          description: "Internal server error"
        }
      }
    },
    delete: {
      tags: ["Memberships Benefits"],
      summary: "Eliminar un beneficio de membresía por id",
      description: "Eliminar un beneficio de membresía por id",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID del beneficio de membresía",
          required: true,
          schema: { 
            type: "string",

          },
        }
      ],
      responses: {
        200: {
          description: "Eliminado con éxito",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MembershipBenefits"
              }
            }
          }
        },
        500: {
          description: "Hubo un error al eliminar"
        }
      }
    }

  },
  "/membership-benefits/user/{id}": {
    get: {
      tags: ["Memberships Benefits"],
      summary: "Obner un beneficio de membresía de un usuario por su id",
      description: "Obtener un beneficio de membresía de un usuario por su id",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID del usuario (client_id)",
          required: true,
          schema: {
            type: "string",
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
                      $ref: "#/components/schemas/MembershipBenefits"
                    }
                  }
                }
              }
            }
          }
        },
        500: {
          description: "Hubó un error al consultar la información"
        }
      }
    }

  },
  "/membership-benefits/Qr/Validate/{id}": {
    post: {
      tags: ["Memberships Benefits"],
      summary: "Validar un beneficio de membresía por su id",
      description: "Validar un beneficio de membresía por su id",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID del beneficio de membresía",
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
                membershipBenefit_id: {
                  type: "string",
                  description: "ID de la membresía",
                },
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
                type: "object",
                properties: {
                  data: {
                    type: "object",
                    $ref: "#/components/schemas/MembershipBenefits"
                  }
                }
              }
            }
          }
        },
        500: {
          description: "Hubó un error al consultar la información"
        }
      }
    }
  },
  "/membership-benefits/sales-day": {
    post: {
      tags: ["Memberships Benefits"],
      summary: "Obtener todos los beneficios de membresía del día",
      description: "Obtener todos los beneficios de membresía del día",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                date_sercvice: {
                  type: "string",
                  format: "date-time",
                  description: "Fecha de los servicios",
                },
                branch_office_id: {
                  type: "string",
                  description: "ID de la sucursal"
                },
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
                type: "object",
                properties: {
                  data: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/MembershipBenefits"
                    }
                  }
                }
              }
            }
          }
        },
        500: {
          description: "Hubó un error al consultar la información"
        }
      }
    }
  },
  "/membership-benefits/consumeBenefit/{id}": {
    post: {
      tags: ["Memberships Benefits"],
      summary: "Consumir un beneficio de membresía por su id",
      description: "Consumir un beneficio de membresía por su id",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID del beneficio de membresía",
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
                membershipBenefit_id: {
                  type: "string",
                  description: "ID del beneficio de membresía",
                },
               typeCar_id: {
                  type: "string",
                  description: "ID del tipo de carro"
                },
                car_color: {
                  type: "string",
                  description: "Color del carro"
                },
                plate_number: {
                  type: "string",
                  description: "Número de placa del carro"
                },
                branch_office_id: {
                  type: "string",
                  description: "ID de la sucursal"
                },
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: "Servicio pagado con éxito",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MembershipBenefits"
              }
            }
          }
        },
        500: {
          description: "Servicio ya consumido"
        }
      }
    }
  },
  "/membership-benefits/useUp/{id}": {
    delete: {
      tags: ["Memberships Benefits"],
      summary: "Consumir un beneficio de membresía por su id",
      description: "Consumir un beneficio de membresía por su id",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID del beneficio de membresía",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          description: "Beneficio consumido con éxito",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MembershipBenefits"
              }
            }
          }
        }
        ,
        500: {
          description: "Hubó un error al consumir el beneficio"
        }
      }
    }
  }


}

export { membershipsBenefits };