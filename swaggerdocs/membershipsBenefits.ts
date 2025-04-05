import { response } from "express";

const membershipsBenefits: any = {
    "/membership-benefits": {
       get:{
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
                500:{
                     description:"Internal server error"
                }
              }
       }
       
    },
    "/membership-benefits/{id}": {
       get:{
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
                500:{
                     description:"Internal server error"
                }
              }
       }
       
    },
    "/membership-benefits/user/{id}": {
        get:{
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
                 "200":{
                        description: "",
                        content: {
                             "application/json": {
                             schema:{
                                type: "object",
                                properties:{
                                    data:{
                                        type:"array",
                                        items:{
                                            $ref:"#/components/schemas/MembershipBenefits"
                                        }
                                    }
                                }
                             }
                        }
                    }
                 },
                 500:{
                      description:"Hubó un error al consultar la información"
                 }
               }
        }
        
     },
     "/membership-benefits/Qr/Validate/{id}": {
        post:{
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
               responses: {
                 200:{
                        description: "",
                        content: {
                             "application/json": {
                             schema:{
                                type:"object",
                                properties:{
                                    data:{
                                        type:"object",
                                        $ref:"#/components/schemas/MembershipBenefits"
                                    }
                                }
                             }
                        }
                    }
                 },
                 500:{
                      description:"Hubó un error al consultar la información"
                 }
               }
        }
     }


}

export { membershipsBenefits };