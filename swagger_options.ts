import { ref } from "pdfkit";
import {
  branchoffice,
  category, subcategory,
  banner, auth, user, cart,
  product, orders,
  address,
  payments,
  discountCoupon,
  dynamicRoutes,
  memberships,
  membershipsBenefits,
  notifications,
  region,
  productOrder,
  services,
  servicesInBranch,
  shippingCost,
  sizeGuide,
  stockStorehouse,
  storeHouse
} from "./swaggerdocs";

export const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "REST API",
      version: "1.0.0",
      description: "The docs of CICHMEX API",
    },
    schemes: ["http", "https"],
    consumes: ["application/json"],
    produces: ["application/json"],
    servers: [
      {
        url: "http://localhost:3000/api",
      },
      {
        url: "http://localhost:3004/api",
      },
      {
        url: "https://api.carwashymas.com/api",
      },
      {
        url: "https://testapi.carwashymas.com/api",
      },
    ],
    security: [{ bearerAuth: [] }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Notifications: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "66a12d5cf2162cfd3c5999c34",
            },
            from: {
              type: "string",
              example: "66a12d5cf2162cfd3c5999c34",
            },
            channel: {
              type: "string",
              enum: ["email", "sms", "inApp"],
              example: "inApp",
            },
            message: {
              type: "string",
              example: "Notification message",
            },
            type: {
              type: "string",
              enum: ["promotion", "order", "payment"],
              example: "promotion",
            },
            resource_id: {
              type: "string",
              example: "66a12d5cf2162cfd3c5999c34",
            },
            user_id: {
              type: "string",
              example: "66a12d5cf2162cfd3c5999c34",
            },
            readed: {
              type: "boolean",
              example: false,
            },
            status: {
              type: "boolean",
              example: true,
            },
          },
        },
        MembershipBenefits: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "66a12d5cf2162cfd3c5999c34",
            },
            membership_id: {
              type: "string",
              example: "66a12d5cf2162cfd3c5999c34",
            },
            service_id: {
              type: "string",
              example: "66a12d5cf2162cfd3c5999c34",
            },
            client_id: {
              type: "string",
              example: "66a12d5cf2162cfd3c5999c34",
            },
            quantity: {
              type: "number",
              example: 10,
            },
            start_date: {
              type: "string",
              format: "date-time",
              example: "2024-07-24T16:35:40.009Z",
            },
            end_date: {
              type: "string",
              format: "date-time",
              example: "2024-08-16T23:01:28.854Z",
            },
            activated: {
              type: "boolean",
              example: true,
            },
            status: {
              type: "boolean",
              example: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-07-24T16:35:40.009Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-08-16T23:01:28.854Z",
            },
          },
        },
        Memberships: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "66a12d5cf2162cfd3c5999c34",
            },

            name: { type: "string" },
            price_standard: { type: "number" },
            discount_porcent: { type: "number" },
            discount_products: { type: "number" },
            price_discount: { type: "number" },
            service_quantity: {
              type: "array",
              items: { type: "string" },
              example: ["service_id_1", "service_id_2"],
            },
            type_cars: {
              type: "array",
              items: { type: "string" },
              example: ["type_car_id_1", "type_car_id_2"],
            },
            status: { type: "boolean" },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-07-24T16:35:40.009Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-08-16T23:01:28.854Z",
            },
          },
        },
        DynamicRoutes: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "66a12d5cf2162cfd3c5999c34",
            },
            uuid: { type: "string" },
            name: { type: "string" },
            path: { type: "string" },
            component: { type: "number" },
            authRequired: { type: "boolean" },
            rolesAllowed: {
              type: "array",
              items: { type: "string" },
              example: ["SUPER-ADMIN", "ADMIN"],
            },
            system: { type: "string" },
            status: { type: "boolean" },
            redirectTo: { type: "string" },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-07-24T16:35:40.009Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-08-16T23:01:28.854Z",
            },
          },
        },
        DiscountCoupon: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "66a12d5cf2162cfd3c5999c34",
            },
            uuid: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            code: { type: "string" },
            percent: { type: "number" },
            fixed_amount: { type: "number" },
            type_discount: {
              type: "string",
              enum: ["free_shipping", "first_buy", "for_creators", "is_amount", "is_percent"],
              description: "Tipo de descuento",
              example: "free_shipping",
            },
            unlimited: { type: "boolean" },
            start_date: { type: "string", format: "date-time" },
            expiration_date: { type: "string", format: "date-time" },
            min_cart_amount: { type: "number" },
            max_cart_amount: { type: "number" },
            for_all_products: { type: "boolean" },
            products: {
              type: "array",
              items: { type: "string" },
              example: ["product_id_1", "product_id_2"],
            },
            creator_id: { type: "string" },
            status: { type: "boolean" },
            is_active: { type: "boolean" },
            maxUses: { type: "number" },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-07-24T16:35:40.009Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-08-16T23:01:28.854Z",
            },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            email: { type: "string" },
            fullname: { type: "string" },
            phone: { type: "string" },
          },
        },
        "AddressEntity": {
          "type": "object",
          "properties": {
            "user_id": {
              "type": "string",
              "description": "ID del usuario propietario de la dirección"
            },
            "name": { "type": "string" },
            "phone": { "type": "string" },
            "street": { "type": "string" },
            "numext": { "type": "string" },
            "numint": { "type": "string" },
            "zipcode": { "type": "string" },
            "city": { "type": "string" },
            "state": { "type": "string" },
            "municipality": { "type": "string" },
            "neighborhood": { "type": "string" },
            "reference": { "type": "string" },
            "btwstreet": { "type": "string" },
            "country": { "type": "string" },
            "status": { "type": "boolean" },
            "default": { "type": "boolean" },
            "lat": { "type": "number" },
            "lgt": { "type": "number" },
            "createdAt": {
              "type": "string",
              "format": "date-time"
            },
            "updatedAt": {
              "type": "string",
              "format": "date-time"
            }
          }
        },
        "Coords": {
          "type": "object",
          "properties": {
            "lat": { "type": "number" },
            "lgt": { "type": "number" }
          }
        },
        AuthResponse: {
          type: "object",
          properties: {
            token: { type: "string" },
            user: { $ref: "#/components/schemas/User" },
          },
        },
        Banner: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "66a12d5cf2162cfd3c5999c34",
            },
            is_active: { type: "string" },
            no_slide: { type: "number" },
            for_discount: { type: "string" },
            discount: { type: "#/components/schemas/DoscountCoupon" },
            title: { type: "string" },
            description: { type: "string" },
            type_event: { type: "string" },
            image_slide: { type: "string" },
            image_slide_movil: { type: "string" },
            status: { type: "boolean" },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-07-24T16:35:40.009Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-08-16T23:01:28.854Z",
            },
          },
        },
        Images: {
          type: "object",
          properties: {
            _id: { type: "string" },
            url: { type: "string" },
            status: { type: "boolean" },
          }
        },
        ILocation: {
          type: "object",
          properties: {
            _id: { type: "string" },
            state_id: { type: "string" },
            municipality: { type: "string" },
            lat: { type: "number" },
            lgt: { type: "number" },
            direction: { type: "string" },
            neighborhood: { type: "string" },
            cp: { type: "string" },
            geLocation: { type: "object" },
          }
        },
        Category: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "66a12d5cf2162cfd3c5999c34",
            },
            name: {
              type: "string",
              example: "categoria",
            },
            status: {
              type: "boolean",
              example: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-07-24T16:35:40.009Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-08-16T23:01:28.854Z",
            },
            category_image: {
              type: "string",
              format: "url",
              example: "https://example.com/image.jpg",
            },
          },
        },
        SubCategory: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "66a12d5cf2162cfd3c5999c34",
            },
            name: {
              type: "string",
              example: "subcategoria",
            },
            status: {
              type: "boolean",
              example: true,
            },
            category_id: {
              type: "string",
              example: "66a12d5cf2162cfd3c5999c34",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-07-24T16:35:40.009Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-08-16T23:01:28.854Z",
            },
            subCategory_image: {
              type: "string",
              format: "url",
              example: "https://example.com/image.jpg",
            },
          },
        },
        BranchOffice: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "624dca3ed5b3b8284f83d1c7",
            },
            activated: {
              type: "boolean",
              example: false,
            },
            name: {
              type: "string",
              example: "Sucursal Central",
            },
            description: {
              type: "string",
              example: "Descripción de la sucursal.",
            },
            phone_number: {
              type: "string",
              example: "+525512345678",
            },
            location: {
              type: "object",
              properties: {
                latitude: { type: "number", example: 19.432608 },
                longitude: { type: "number", example: -99.133209 },
              },
            },
            schedules: {
              type: "string",
              example: '[{"day":"Monday", "open":"09:00", "close":"18:00"}]',
            },
            type: {
              type: "string",
              enum: ["carwash", "deliverypoint"],
              description: "Tipo de sucursal",
              example: "carwash",
            },
            images: {
              type: "array",
              items: { type: "string" },
              example: ["branch_image_1", "branch_image_2"],
            },
            status: {
              type: "boolean",
              example: true,
            },
          },
        },
        "CartResponse": {
          "type": "object",
          "properties": {
            "data": {
              "type": "object",
              "properties": {
                "_id": { "type": "string", "example": "332a3ed1ce58cef8ae932456" },
                "user_id": { "type": "string", "example": "332a3ed1ce58cef8ae932456" },
                "products": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "item": {
                        "type": "object",
                        "properties": {
                          "_id": { "type": "string", "example": "678a7ab92cd46fba828f330d" },
                          "name": { "type": "string", "example": "product example" },
                          "brand": { "type": "string", "example": "brand" },
                          "category": { "type": "string", "example": "66a12abbf2162cfd3c599969" },
                          "subCategory": { "type": "string", "example": "66a134d8f2162cfd3c599bfc" },
                          "currency": { "type": "string", "example": "MX" },
                          "status": { "type": "boolean", "example": true },
                          "seoKeywords": { "type": "array", "items": { "type": "string" } },
                          "gender": { "type": "string", "example": "Niñas" },
                          "model": { "type": "string", "example": "generic" },
                          "has_variants": { "type": "boolean", "example": true },
                          "images": { "type": "array", "items": { "type": "object" } },
                          "videos": {
                            "type": "array",
                            "items": {
                              "type": "object",
                              "properties": {
                                "url": { "type": "string", "example": "https://example.com/video.mp4" },
                                "type": { "type": "string", "example": "horizontal" },
                                "createdAt": { "type": "string", "format": "date-time" },
                                "updatedAt": { "type": "string", "format": "date-time" },
                                "_id": { "type": "string" }
                              }
                            }
                          },
                          "createdAt": { "type": "string", "format": "date-time" },
                          "updatedAt": { "type": "string", "format": "date-time" },
                          "size_guide": { "type": "string", "example": "6789551f6ca756671f567c5c" },
                          "description": { "type": "string", "example": "213213" },
                          "shortDescription": { "type": "string", "example": "short description" }
                        }
                      },
                      "variant": {
                        "type": "object",
                        "nullable": true,
                        "properties": {
                          "_id": { "type": "string", "example": "678a7ad92cd46fba828f3318" },
                          "product_id": { "type": "string", "example": "678a7ab92cd46fba828f330d" },
                          "sku": { "type": "string", "example": "ee7a39b0-7fc6-4ece-bbeb-957b77b2224a" },
                          "attributes": {
                            "type": "object",
                            "properties": {
                              "color": { "type": "string", "example": "Púrpura" },
                              "size": { "type": "string", "example": "Grande" },
                              "material": { "type": "string", "nullable": true },
                              "_id": { "type": "string" }
                            }
                          },
                          "design": { "type": "string", "example": "" },
                          "status": { "type": "boolean", "example": true },
                          "price": { "type": "number", "example": 700 },
                          "discountPrice": { "type": "number", "example": 700 },
                          "porcentDiscount": { "type": "number", "example": 0 },
                          "currency": { "type": "string", "example": "MX" },
                          "weight": { "type": "number", "example": 70000 },
                          "tag": { "type": "string", "example": "21321" },
                          "is_main": { "type": "boolean", "example": true },
                          "images": {
                            "type": "array",
                            "items": {
                              "type": "object",
                              "properties": {
                                "_id": { "type": "string" },
                                "url": { "type": "string", "example": "https://example.com/image.jpeg" }
                              }
                            }
                          },
                          "createdAt": { "type": "string", "format": "date-time" },
                          "updatedAt": { "type": "string", "format": "date-time" }
                        }
                      },
                      "quantity": { "type": "number", "example": 1 },
                      "_id": { "type": "string" },
                      "stock": { "type": "number", "example": 10 }
                    }
                  }
                },
                // "memberships": { "type": "array", "items": { "type": "object" } },
                "status": { "type": "boolean", "example": true },
                "createdAt": { "type": "string", "format": "date-time" },
                "updatedAt": { "type": "string", "format": "date-time" },
                "total_cart": { "type": "number", "example": 70724 }
              }
            }
          }
        },
        Product: {
          "type": "object",
          "properties": {
            "item": {
              "type": "object",
              "properties": {
                "_id": { "type": "string", "example": "678a7ab92cd46fba828f330d" },
                "name": { "type": "string", "example": "product example" },
                "brand": { "type": "string", "example": "brand" },
                "category": { "type": "string", "example": "66a12abbf2162cfd3c599969" },
                "subCategory": { "type": "string", "example": "66a134d8f2162cfd3c599bfc" },
                "currency": { "type": "string", "example": "MX" },
                "status": { "type": "boolean", "example": true },
                "seoKeywords": { "type": "array", "items": { "type": "string" } },
                "gender": { "type": "string", "example": "Niñas" },
                "model": { "type": "string", "example": "generic" },
                "has_variants": { "type": "boolean", "example": true },
                "images": { "type": "array", "items": { "type": "object" } },
                "createdAt": { "type": "string", "format": "date-time" },
                "updatedAt": { "type": "string", "format": "date-time" },
                "size_guide": { "type": "string", "example": "6789551f6ca756671f567c5c" },
                "description": { "type": "string", "example": "213213" },
                "shortDescription": { "type": "string", "example": "short description" }
              }
            },
            "variant": {
              "type": "object",
              "nullable": true,
              "properties": {
                "_id": { "type": "string", "example": "678a7ad92cd46fba828f3318" },
                "product_id": { "type": "string", "example": "678a7ab92cd46fba828f330d" },
                "sku": { "type": "string", "example": "ee7a39b0-7fc6-4ece-bbeb-957b77b2224a" },
                "attributes": {
                  "type": "object",
                  "properties": {
                    "color": { "type": "string", "example": "Púrpura" },
                    "size": { "type": "string", "example": "Grande" },
                    "material": { "type": "string", "nullable": true },
                    "_id": { "type": "string" }
                  }
                },
                "design": { "type": "string", "example": "" },
                "status": { "type": "boolean", "example": true },
                "price": { "type": "number", "example": 700 },
                "discountPrice": { "type": "number", "example": 700 },
                "porcentDiscount": { "type": "number", "example": 0 },
                "currency": { "type": "string", "example": "MX" },
                "weight": { "type": "number", "example": 70000 },
                "tag": { "type": "string", "example": "21321" },
                "is_main": { "type": "boolean", "example": true },
                "images": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "_id": { "type": "string" },
                      "url": { "type": "string", "example": "https://example.com/image.jpeg" }
                    }
                  }
                },
                "createdAt": { "type": "string", "format": "date-time" },
                "updatedAt": { "type": "string", "format": "date-time" }
              }
            },
            "quantity": { "type": "number", "example": 1 },
            "_id": { "type": "string" },
            "stock": { "type": "number", "example": 10 }
          }

        },
        Products: {
          "type": "object",
          "properties": {
            "products": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "item": {
                    "type": "object",
                    "properties": {
                      "_id": { "type": "string", "example": "678a7ab92cd46fba828f330d" },
                      "name": { "type": "string", "example": "product example" },
                      "brand": { "type": "string", "example": "brand" },
                      "category": { "type": "string", "example": "66a12abbf2162cfd3c599969" },
                      "subCategory": { "type": "string", "example": "66a134d8f2162cfd3c599bfc" },
                      "currency": { "type": "string", "example": "MX" },
                      "status": { "type": "boolean", "example": true },
                      "seoKeywords": { "type": "array", "items": { "type": "string" } },
                      "gender": { "type": "string", "example": "Niñas" },
                      "model": { "type": "string", "example": "generic" },
                      "has_variants": { "type": "boolean", "example": true },
                      "images": { "type": "array", "items": { "type": "object" } },
                      "videos": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "url": { "type": "string", "example": "https://example.com/video.mp4" },
                            "type": { "type": "string", "example": "horizontal" },
                            "createdAt": { "type": "string", "format": "date-time" },
                            "updatedAt": { "type": "string", "format": "date-time" },
                            "_id": { "type": "string" }
                          }
                        }
                      },
                      "createdAt": { "type": "string", "format": "date-time" },
                      "updatedAt": { "type": "string", "format": "date-time" },
                      "size_guide": { "type": "string", "example": "6789551f6ca756671f567c5c" },
                      "description": { "type": "string", "example": "213213" },
                      "shortDescription": { "type": "string", "example": "short description" }
                    }
                  },
                  "variant": {
                    "type": "object",
                    "nullable": true,
                    "properties": {
                      "_id": { "type": "string", "example": "678a7ad92cd46fba828f3318" },
                      "product_id": { "type": "string", "example": "678a7ab92cd46fba828f330d" },
                      "sku": { "type": "string", "example": "ee7a39b0-7fc6-4ece-bbeb-957b77b2224a" },
                      "attributes": {
                        "type": "object",
                        "properties": {
                          "color": { "type": "string", "example": "Púrpura" },
                          "size": { "type": "string", "example": "Grande" },
                          "material": { "type": "string", "nullable": true },
                          "_id": { "type": "string" }
                        }
                      },
                      "design": { "type": "string", "example": "" },
                      "status": { "type": "boolean", "example": true },
                      "price": { "type": "number", "example": 700 },
                      "discountPrice": { "type": "number", "example": 700 },
                      "porcentDiscount": { "type": "number", "example": 0 },
                      "currency": { "type": "string", "example": "MX" },
                      "weight": { "type": "number", "example": 70000 },
                      "tag": { "type": "string", "example": "21321" },
                      "is_main": { "type": "boolean", "example": true },
                      "images": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "_id": { "type": "string" },
                            "url": { "type": "string", "example": "https://example.com/image.jpeg" }
                          }
                        }
                      },
                      "createdAt": { "type": "string", "format": "date-time" },
                      "updatedAt": { "type": "string", "format": "date-time" }
                    }
                  },
                  "quantity": { "type": "number", "example": 1 },
                  "_id": { "type": "string" },
                  "stock": { "type": "number", "example": 10 }
                }
              }
            },

          }
        },
        ProductOrder: {
          type: "object",
          properties: {
            _id: { type: "string" },
            order_id: { type: "string" },
            payment: { reference: "#/components/schemas/Payment" },
            payment_status: { type: "string" },
            user_id: { type: "string" },
            products: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  item: { $ref: "#/components/schemas/Product" },
                  variant: { $ref: "#/components/schemas/VariantProduct" },
                  quantity: { type: "number" },
                  _id: { type: "string" },
                  stock: { type: "number" }
                }
              }
            },
            discount: { type: "number" },
            subTotal: { type: "number" },
            total: { type: "number" },
            shippingCost: { type: "number" },
            branch: {
              reference: "#/components/schemas/BranchOffice"
            },
            storeHouseStatus: { type: "string" },
            supply_detail: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  product_id: { type: "string" },
                  status: { type: "boolean" },
                  section: { type: "string" },
                  quantity: { type: "number" },
                  type: { type: "string" },
                  user: { reference: "#/components/schemas/User" },
                  date: { type: "string", format: "date-time" },

                },
                route_status: { type: "boolean" },
                route_detail: {
                  type: "object",
                  properties: {
                    user: { reference: "#/components/schemas/User" },
                    route_status: { type: "string" },
                    end_shipping_date: { type: "string", format: "date-time" },
                    start_shipping_date: { type: "string", format: "date-time" },
                    guide: { type: "string" },
                    shipping_company: { type: "string" },
                    guide_pdf: { type: "string" },
                    user_receiver: { type: "string" },
                  }
                },
                point_pickup_status: { type: "boolean" },
                deliveryStatus: { type: "boolean" },
                status: { type: "boolean" },
                paymentType: { type: "string" },
                download_ticket: { type: "string" },
                typeDelivery: { type: "string" },
                origin: { type: "string" },
                requiredTax: { type: "boolean" },
                facturapi_tax_id: { type: "string" },
                tax_expiration_date: { type: "string", format: "date-time" },
                order_status: { type: "number" },
                coupon: { reference: "#/components/schemas/DiscountCoupon" },
                verification: {
                  type: "object", properties: {
                    verification_code: { type: "string" },
                    verification_status: { type: "boolean" },
                    verification_time: { type: "string" },
                  }
                },
                createdAt: { type: "string", format: "date-time" },
                updatedAt: { type: "string", format: "date-time" },
              }
            }
          }
        },
        ProductsReponsePaginate: {
          type: "object",
          properties: {
            totalProducts: { type: "number", example: 10 },
            totalPages: { type: "number", example: 1 },
            currentPage: { type: "number", example: 1 },
            pageSize: { type: "number", example: 10 },
            products: {
              type: "array",
              items: { $ref: "#/components/schemas/Products" }
            }
          },
        },
        Payment: {
          type: "object",
          properties: {
            _id: { type: "string" },
            uuid: { type: "string" },
            user_id: { type: "string" },
            MP_info: { type: "object" },
            status: { type: "boolean" },
            payment_status: { type: "string" },
            system: { type: "string" },
            products: { type: "object" },
            verification: { type: "object" },
            order_id: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          }
        },
        VariantProduct: {
          type: "object",
          properties: {
            _id: { type: "string" },
            product_id: { type: "string" },
            sku: { type: "string" },
            attributes: { type: "object" },
            design: { type: "string" },
            images: { type: "array", items: { type: "object" } },
            price: { type: "number" },
            discountPrice: { type: "number" },
            porcentDiscount: { type: "number" },
            dimensions: { type: "string" },
            currency: { type: "string" },
            status: { type: "boolean" },
            weight: { type: "number" },
            rating: { type: "number" },
            purchase_price: { type: "number" },
            tag: { type: "string" },
            is_main: { type: "boolean" },
          }
        },
        Region: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            regionCode: { type: "string" },
            type: {
              type: "string",
              enum: ["polygon", "circle", "rectangle"],
              description: "Tipo de región",
              example: "polygon",
            },
            path: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  lat: { type: "number" },
                  lng: { type: "number" }
                }
              }
            },
            radius: { type: "number" },
            center: {
              type: "object",
              properties: {
                lat: { type: "number" },
                lng: { type: "number" }
              }
            },
            status: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          }
        },
        Services: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            image: { type: "string" },
            subCategory: { $ref: "#/components/schemas/SubCategory" },
            status: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          }
        },
        ServicesInBranch: {
          type: "object",
          properties: {
            _id: { type: "string" },
            branch_id: { type: "string" },
            service_id: { type: "string" },
            typeCar_id: { type: "string" },
            price: { type: "number" },
            description: { type: 'string' },
            status: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          }
        },
        ShippingCost: {
          type: "object",
          properties: {
            _id: { type: "string" },
            uuid: { type: "string" },
            starting_weight: { type: "number" },
            end_weight: { type: "number" },
            price_weight: { type: "number" },
            status: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          }
        },
        SizeGuide: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            dimensions: { type: "object" },
            user_id: { type: "string", example: "id del usuario" },
            region: { type: "string", example: "Usa, Mex" },
            unit: { type: "string", example: "cm, inches" },
            typePackage: { type: "string", example: "Granel, Envasado" },
            status: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          }
        },
        StockStoreHouse: {
          type: 'object',
          properties: {
            _id: { type: "string" },
            StoreHouse_id: { type: "string" },
            product_id: { type: "string" },
            variant_id: { type: "string" },
            stock: { type: "number" },
            status: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          }
        },
        StockSHInput: {
          type: 'object',
          properties: {
            _id: { type: "string" },
            folio: { type: "string" },
            SHStock_id: { type: "string" },
            quantity: { type: "number" },
            newQuantity: { type: "number" },
            responsible: { type: "object" },
            user_received: { type: "object" },
            user_arrange: { type: "object" },
            user_delivery: { type: "object" },
            product_detail: { type: "object" },
            in_storehouse: { type: "boolean" },
            in_section: { type: "boolean" },
            notes: { type: "string" },
            date_received: { type: "string" },
            quantity_received: { type: "string" },
            status: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          }
        },
        StockSHOutput: {
          type: 'object',
          properties: {
            _id: { type: "string" },
            folio: { type: "string" },
            order_id: { type: "string" },
            SHStock_id: { type: "string" },
            quantity: { type: "number" },
            newQuantity: { type: "number" },
            responsible: { type: "object" },
            reason: { type: "string" },
            user_received: { type: "object" },
            user_delivery: { type: "object" },
            product_detail: { type: "object" },
            status: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          }
        },
        "StoreHouse": {
          "type": "object",
          "properties": {
            "_id": { "type": "string" },
            "storehouse_key": { "type": "string" },
            "user_id": { "type": "string" },
            "name": { "type": "string" },
            "description": { "type": "string" },
            "phone_number": { "type": "string" },
            "images": {
              "type": "array",
              "items": { "$ref": "#/components/schemas/Images" }
            },
            "location": { "$ref": "#/components/schemas/ILocation" },
            tag:{ type: "string"},
            "status": { "type": "boolean" },
            "createdAt": { "type": "string", "format": "date-time" },
            "updatedAt": { "type": "string", "format": "date-time" }
          }
        },
        



      },
    },
    paths: {
      ...address,
      ...auth,
      ...banner,
      ...branchoffice,
      ...category,
      ...cart,
      ...discountCoupon,
      ...dynamicRoutes,
      ...memberships,
      ...membershipsBenefits,
      ...notifications,
      ...orders,
      ...payments,
      ...product,
      ...productOrder,
      ...region,
      ...subcategory,
      ...services,
      ...servicesInBranch,
      ...shippingCost,
      ...sizeGuide,
      ...stockStorehouse,
      ...storeHouse,
      ...user,


    },
  },
  apis: ["./src/shared/infrastructure/routes/Router.ts"],
};
