const auth: any = {
  "/user/loginByPhone":{
    post:{
      tags:["Login phone"],
      description:"Login user by phone",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                phone_number: { type: "number" },
                password: { type: "string" },
              },
              required: ["email", "password"],
            },
          },
        },
      },
      // parameters: [
      //   {
      //     name: "phone_number",
      //     in: "body",
      //     required: true,
      //     type: "string",                    
      //   },
      //   {
      //     name: "password",
      //     in: "body",
      //     required: true,
      //     type: "string",          
      //   },
      // ],
      responses: {
        "200": {
          description: "User authentication response",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  data: {
                    type: "object",
                    properties: {
                      token: {
                        type: "string",
                        example:
                          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiYThmNWI0MmMtYWU3ZS00ZDI1LWE2YzAtYjdjYTY0M2EyOTYzIiwiaWF0IjoxNzMwMzE0NDY1LCJleHAiOjE3MzA0MDA4NjV9.V3ZTNMEFXB0mlwdnzdDX-5mjmZ1FunQtaGU3kKDLqwM",
                      },
                      user: {
                        type: "object",
                        properties: {
                          _id: {
                            type: "string",
                            example: "1234567890abcdef12345678",
                          },
                          uuid: {
                            type: "string",
                            example: "abcdef12-3456-7890-abcd-ef1234567890",
                          },
                          fullname: { type: "string", example: "John Doe" },
                          email: {
                            type: "string",
                            format: "email",
                            example: "johndoe@example.com",
                          },
                          type_user: {
                            type: "object",
                            properties: {
                              _id: {
                                type: "string",
                                example: "abcdef1234567890abcdef12",
                              },
                              system: {
                                type: "array",
                                items: { type: "string", example: "CICHMEX" },
                              },
                              role: {
                                type: "array",
                                items: { type: "string", example: "CUSTOMER" },
                              },
                            },
                          },
                          phone_id: {
                            type: "object",
                            properties: {
                              _id: {
                                type: "string",
                                example: "abcdef1234567890abcdef12",
                              },
                              prefix: { type: "string", example: "+52" },
                              phone_number: {
                                type: "number",
                                example: 1234567890,
                              },
                              verified: { type: "boolean", example: true },
                            },
                          },
                          email_verified: { type: "boolean", example: false },
                          status: { type: "boolean", example: true },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-10-30T18:54:25.264Z",
                          },
                          updatedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-10-30T18:54:25.264Z",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/user/send-code": {
    post: {
      tags: ["Register phone"],
      description: "Return a code to verify the phone number",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                prefix: { type: "number" },
                phone_number: { type: "string" },
              },
              required: ["prefix", "phone_number"],
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Code sent successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  data: {
                    type: "object",
                    properties: {
                      phone_id: { type: "string", example: "id" },
                      verified: { type: "boolean", example: false },
                      phone_number: { type: "number", example: 7222222222 },
                    },
                  },
                  message: {
                    type: "string",
                    example: 'Codigo enviado con éxito al "+527222222222"',
                  },
                },
              },
            },
          },
        },
        "500": {
          description: "Internal Server Error",
        },
        "400": {
          description: "Bad Request",
        },
      },
    },
  },
  "/user/verify-phone/:id": {
    post: {
      tags: ["Register phone"],
      description: "Verify the phone number",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "the id of the phone",
        },
        {
          name: "code",
          in: "body",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        "200": {
          description: "Phone verification data",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  data: {
                    type: "object",
                    properties: {
                      _id: {
                        type: "string",
                        example: "67226f04756ec5fc960f1111",
                      },
                      code: { type: "string", example: "599578" },
                      prefix: { type: "string", example: "+52" },
                      phone_number: { type: "number", example: 7222222222 },
                      verified: { type: "boolean", example: true },
                      status: { type: "boolean", example: true },
                      createdAt: {
                        type: "string",
                        format: "date-time",
                        example: "2024-10-30T17:38:12.802Z",
                      },
                      updatedAt: {
                        type: "string",
                        format: "date-time",
                        example: "2024-10-30T17:58:00.930Z",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "500": {
          description: "Internal Server Error",
        },
        "400": {
          description: "Bad Request",
        },
      },
    },
  },
  "/user/registerbyPhone": {
    post: {
      tags: ["Register phone"],
      description: "Complete the user register with his data",
      parameters: [
        {
          name: "email",
          in: "body",
          required: true,
          schema: {
            type: "string",
            format: "email",
            example: "user@example.com",
          },
        },
        {
          name: "fullname",
          in: "body",
          required: true,
          schema: {
            type: "string",
            example: "John Doe",
          },
        },
        {
          name: "password",
          in: "body",
          required: true,
          schema: {
            type: "string",
            example: "SecurePassword123",
          },
        },
        {
          name: "phone_id",
          in: "body",
          required: true,
          schema: {
            type: "string",
            example: "12345abcde67890fghij",
          },
        },
        {
          name: "system",
          in: "body",
          required: true,
          schema: {
            type: "string",
            example: "CICHMEX",
          },
        },
        {
          name: "role",
          in: "body",
          required: true,
          schema: {
            type: "string",
            example: "CUSTOMER",
          },
        },
      ],
      responses: {
        "200": {
          description: "User authentication response",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  data: {
                    type: "object",
                    properties: {
                      token: {
                        type: "string",
                        example:
                          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiYThmNWI0MmMtYWU3ZS00ZDI1LWE2YzAtYjdjYTY0M2EyOTYzIiwiaWF0IjoxNzMwMzE0NDY1LCJleHAiOjE3MzA0MDA4NjV9.V3ZTNMEFXB0mlwdnzdDX-5mjmZ1FunQtaGU3kKDLqwM",
                      },
                      user: {
                        type: "object",
                        properties: {
                          _id: {
                            type: "string",
                            example: "1234567890abcdef12345678",
                          },
                          uuid: {
                            type: "string",
                            example: "abcdef12-3456-7890-abcd-ef1234567890",
                          },
                          fullname: { type: "string", example: "John Doe" },
                          email: {
                            type: "string",
                            format: "email",
                            example: "johndoe@example.com",
                          },
                          type_user: {
                            type: "object",
                            properties: {
                              _id: {
                                type: "string",
                                example: "abcdef1234567890abcdef12",
                              },
                              system: {
                                type: "array",
                                items: { type: "string", example: "CICHMEX" },
                              },
                              role: {
                                type: "array",
                                items: { type: "string", example: "CUSTOMER" },
                              },
                            },
                          },
                          phone_id: {
                            type: "object",
                            properties: {
                              _id: {
                                type: "string",
                                example: "abcdef1234567890abcdef12",
                              },
                              prefix: { type: "string", example: "+52" },
                              phone_number: {
                                type: "number",
                                example: 1234567890,
                              },
                              verified: { type: "boolean", example: true },
                            },
                          },
                          email_verified: { type: "boolean", example: false },
                          status: { type: "boolean", example: true },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-10-30T18:54:25.264Z",
                          },
                          updatedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-10-30T18:54:25.264Z",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/auth/user": {
    get: {
      tags: ["Auth"],
      description: "Revalidate token",
      // security: [{ bearerAuth: [] }],
      responses: {
        "200": {
          description: "Token revalidated successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User",
              },
            },
          },
        },
        "500": {
          description: "Internal Server Error",
        },
      },
    },
  },
  "/auth/login": {
    post: {
      tags: ["Auth"],
      description: "Login user",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: { type: "string" },
                password: { type: "string" },
              },
              required: ["email", "password"],
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Login successful",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AuthResponse",
              },
            },
          },
        },
        "500": {
          description: "Internal Server Error",
        },
      },
    },
  },
  "/auth/partner": {
    post: {
      tags: ["Auth"],
      description: "Login partner",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: { type: "string" },
                password: { type: "string" },
              },
              required: ["email", "password"],
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Login successful",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AuthResponse",
              },
            },
          },
        },
        "500": {
          description: "Internal Server Error",
        },
      },
    },
  },
  "/auth/register": {
    post: {
      tags: ["Auth"],
      description: "Register user",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                fullname: { type: "string" },
                email: { type: "string" },
                password: { type: "string" },
                phone: { type: "string" },
              },
              required: ["fullname", "email", "password", "phone"],
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Registration successful",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AuthResponse",
              },
            },
          },
        },
        "500": {
          description: "Internal Server Error",
        },
      },
    },
  },
  "/auth/register-Pay": {
    post: {
      tags: ["Auth"],
      description: "Register and Pay",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                fullname: { type: "string" },
                email: { type: "string" },
                password: { type: "string" },
                system: { type: "string" },
              },
              required: ["fullname", "email", "password", "system"],
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Registration and Payment successful",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AuthResponse",
              },
            },
          },
        },
        "500": {
          description: "Internal Server Error",
        },
      },
    },
  },
  "/auth/registerAdmin/seed": {
    post: {
      tags: ["Auth"],
      description: "Register Admin",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                fullname: { type: "string" },
                email: { type: "string" },
                password: { type: "string" },
                phone: { type: "string" },
                type_user: { type: "string" },
              },
              required: ["fullname", "email", "password", "phone", "type_user"],
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Admin registration successful",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AuthResponse",
              },
            },
          },
        },
        "500": {
          description: "Internal Server Error",
        },
      },
    },
  },
  "/auth/google": {
    post: {
      tags: ["Auth Google"],
      description: "Login with Google",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                idToken: { type: "string" },
              },
              required: ["idToken"],
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Login with Google successful",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AuthResponse",
              },
            },
          },
        },
        "500": {
          description: "Internal Server Error",
        },
      },
    },
  },
  "/auth/google-Partner": {
    post: {
      tags: ["Auth"],
      description: "Login with Google for Partner",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                idToken: { type: "string" },
              },
              required: ["idToken"],
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Login with Google for Partner successful",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AuthResponse",
              },
            },
          },
        },
        "500": {
          description: "Internal Server Error",
        },
      },
    },
  },
  "/auth/registerByGoogle": {
    post: {
      tags: ["Auth Google"],
      description: "Register by Google",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                idToken: { type: "string" },
                system: { type: "string" },
              },
              required: ["idToken", "system"],
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Registration by Google successful",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AuthResponse",
              },
            },
          },
        },
        "500": {
          description: "Internal Server Error",
        },
      },
    },
  },
  "/auth/send-email-restore": {
    post: {
      tags: ["Auth"],
      description: "Send email to restore password",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: { type: "string" },
              },
              required: ["email"],
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Email sent to restore password",
        },
        "404": {
          description: "User not found",
        },
        "500": {
          description: "Internal Server Error",
        },
      },
    },
  },
  "/auth/verifyCodeRP": {
    post: {
      tags: ["Auth"],
      description: "Verify code for password restoration",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                code: { type: "string" },
                email: { type: "string" },
              },
              required: ["code", "email"],
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Code verified successfully",
        },
        "404": {
          description: "Invalid code or email",
        },
        "500": {
          description: "Internal Server Error",
        },
      },
    },
  },
  "/auth/change-password/{id}": {
    post: {
      tags: ["Auth"],
      description: "Change password",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                password: { type: "string" },
                new_password: { type: "string" },
              },
              required: ["password", "new_password"],
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Password changed successfully",
        },
        "500": {
          description: "Internal Server Error",
        },
      },
    },
  },
};

export { auth };
