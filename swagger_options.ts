import { branchoffice, category, subcategory, auth, user, cart, product, orders } from "./swaggerdocs";
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
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            email: { type: "string" },
            fullname: { type: "string" },
            phone: { type: "string" },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            token: { type: "string" },
            user: { $ref: "#/components/schemas/User" },
          },
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
      },
    },
    paths: {
      ...auth,
      ...user,
      ...cart,
      ...product,
      ...orders,
      ...category,
      ...subcategory,
      ...branchoffice,
    },
  },
  apis: ["./src/shared/infrastructure/routes/Router.ts"],
};
