import { get } from "http";

const orders = {
    "/product-order/:id": {
        get: {
             tags: ["orders"],
             description: ["obtiene un pedido por id"], 
             parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "id of order",
                    required: true,
                    type: "string"
                }
             ]                         
        },
        delete: {
            tags: ["orders"],
            description: ["cancelar un por id"], 
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "id of order",
                    required: true,
                    type: "string"
                }
             ]
        },
    },    
    "/product-order/user/resume" : {
        get: {
             tags: ["orders"],
             description: ["obtiene los pedidos del usuario"], 
             parameters: [
                // {
                //     name: "id",
                //     in: "path",
                //     description: "id of order",
                //     required: true,
                //     type: "string"
                // }
             ]                         
        },
    }

}

export { orders };