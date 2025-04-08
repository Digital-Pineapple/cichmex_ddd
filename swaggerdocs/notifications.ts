const notifications = {
   "/notification/testingSocket": {
      get: {
         tags: ["Notification"],
         summary: "Testing Socket",
         description: "Testing Socket",
         operationId: "testingSocket",
         parameters: [],
         responses: {
            200: {
               description: "Success",
               content: {
                  "application/json": {
                     schema: {
                        type: "object",
                        properties: {   
                            message: {
                                type: "string",
                                example: "Socket event sent successfully",
                            },
                            },
                        },
                     example: {
                        message: "Socket event sent successfully",
                     },
                  },
               },
            },
            500: {
               description: "Internal Server Error",
               content: {
                  "application/json": {
                     schema: {
                        type: "object",
                        properties: {
                           message: {
                              type: "string",
                              example: "Internal Server Error",
                           },
                        },
                     },
                     example: {
                        message: "Internal Server Error",
                     },
                  },
               },
            },
         },
         security: [
            {
               bearerAuth: [],
            },
         ],
      },
   },
   "/notification/user": {
      get: {
         tags: ["Notification"],
         summary: "Get Notifications by User",
         description: "Get Notifications by User",
         operationId: "getNotificationsByUser",
         parameters: [
            {
               name: "userId",
               in: "query",
               required: true,
               description: "User ID",
               schema: {
                  type: "string",
               },
            },
         ],
         responses: {
            200: {
               description: "Success",
               content: {
                  "application/json": {
                     schema: {
                        type: "object",
                        properties: {
                           notifications: {
                              type: "array",
                              items: {
                                 type: "object",
                                 properties: {
                                    id: {
                                       type: "string",
                                       example: "notificationId",
                                    },
                                    title: {
                                       type: "string",
                                       example: "Notification Title",
                                    },
                                    message: {
                                       type: "string",
                                       example: "Notification Message",
                                    },
                                    read: {
                                       type: "boolean",
                                       example: false,
                                    },
                                    createdAt: {
                                       type: "string",
                                       format: "date-time",
                                       example: "2023-10-01T12:00:00Z",
                                    },
                                    updatedAt: {
                                       type: "string",
                                       format: "date-time",
                                       example: "2023-10-01T12:00:00Z",
                                    },
                                 },
                              },
                           },
                        },
                     },
                     example: {
                        notifications: [
                           {
                              id: "notificationId",
                              title: "Notification Title",
                              message: "Notification Message",
                              read: false,
                              createdAt: "2023-10-01T12:00:00Z",
                              updatedAt: "2023-10-01T12:00:00Z",
                           },
                        ],
                     },
                  },
               },
            },
            400: {
               description: "Bad Request",
               content: {
                  "application/json": {
                     schema: {
                        type: "object",
                        properties: {
                           message: {
                              type: "string",
                              example: "Bad Request",
                           },
                        },
                     },
                     example: {
                        message: "Bad Request",
                     },
                  },
               },
            },
            500: {
               description: "Internal Server Error",
               content: {
                  "application/json": {
                     schema: {
                        type: "object",
                        properties: {
                           message: {
                              type: "string",
                              example: "Internal Server Error",
                           },
                        },
                     },
                     example: {
                        message: "Internal Server Error",
                     },
                  },
               },
            },
         },
            security: [
            {
               bearerAuth: [],
            },
            ],
        },
    },
    "/notification": {
        post: {
            tags: ["Notification"],
            summary: "Create Notification",
            description: "Create Notification",
            operationId: "createNotification",
            requestBody: {
                required: true,
                content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            title: {
                            type: "string",
                            example: "Notification Title",
                            },
                            message: {
                            type: "string",
                            example: "Notification Message",
                            },
                            userId: {
                            type: "string",
                            example: "userId",
                            },
                        },
                    },
                },
                },
            },
            responses: {
                201: {
                description: "Created",
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                            message: {
                                type: "string",
                                example: "Notification created successfully",
                            },
                            },
                        },
                        example: {
                            message: "Notification created successfully",
                        },
                    },
                },
                },
                400: {
                description: "Bad Request",
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                            message: {
                                type: "string",
                                example: "Bad Request",
                            },
                            },
                        },
                        example: {
                            message: "Bad Request",
                        },
                    },
                },
                },
                500: {
                description: "Internal Server Error",
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                            message: {
                                type: "string",
                                example: "Internal Server Error",
                            },
                            },
                        },
                        example: {
                            message: "Internal Server Error",
                        },
                    },
                },
                },
            }, 
            security:[
                { 
                bearerAuth:[]
                }
            ]
        },
    },
    "/notification/{id}/markAsRead": {
        put: {
            tags: ["Notification"],
            summary: "Mark Notification as Read",
            description: "Mark Notification as Read",
            operationId: "markNotificationAsRead",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "Notification ID",
                    schema: {
                        type: "string",
                    },
                },
            ],
            responses: {
                200: {
                    description: "Success",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "Notification marked as read successfully",
                                    },
                                },
                            },
                            example: {
                                message: "Notification marked as read successfully",
                            },
                        },
                    },
                },
                400: {
                    description: "Bad Request",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "Bad Request",
                                    },
                                },
                            },
                            example: {
                                message: "Bad Request",
                            },
                        },
                    },
                },
                404: {
                    description: "Not Found",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "Notification not found",
                                    },
                                },
                            },
                            example: {
                                message: "Notification not found",
                            },
                        },
                    },
                },                
                500:{
                    description:"Internal Server Error", 
                    content:{
                        'application/json':{
                            schema:{
                                type:'object',
                                properties:{
                                    message:{
                                        type:'string',
                                        example:'Internal Server Error'
                                    }
                                }
                            }
                        }
                    }
                }
            }, 
            security:[
                { 
                bearerAuth:[]
                }
            ]
        },   
    },
    "/notification/markAllAsReaded": {
        put: {
            tags: ["Notification"],
            summary: "Mark All Notifications as Read",
            description: "Mark All Notifications as Read",
            operationId: "markAllNotificationsAsRead",
            responses: {
                200: {
                    description: "Success",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "All notifications marked as read successfully",
                                    },
                                },
                            },
                            example: {
                                message: "All notifications marked as read successfully",
                            },
                        },
                    },
                },
                500:{
                    description:"Internal Server Error", 
                    content:{
                        'application/json':{
                            schema:{
                                type:'object',
                                properties:{
                                    message:{
                                        type:'string',
                                        example:'Internal Server Error'
                                    }
                                }
                            }
                        }
                    }
                }
            }, 
            security:[
                { 
                bearerAuth:[]
                }
            ]
        },   
    },
    "/notification/{id}": {
        delete: {
            tags: ["Notification"],
            summary: "Delete Notification",
            description: "Delete Notification",
            operationId: "deleteNotification",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "Notification ID",
                    schema: {
                        type: "string",
                    },
                },
            ],
            responses: {
                200: {
                    description: "Success",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "Notification deleted successfully",
                                    },
                                },
                            },
                            example: {
                                message: "Notification deleted successfully",
                            },
                        },
                    },
                },
                404:{
                    description:"Not Found", 
                    content:{
                        'application/json':{
                            schema:{
                                type:'object',
                                properties:{
                                    message:{
                                        type:'string',
                                        example:'Notification not found'
                                    }
                                }
                            }
                        }
                    }
                },                
                500:{
                    description:"Internal Server Error", 
                    content:{
                        'application/json':{
                            schema:{
                                type:'object',
                                properties:{
                                    message:{
                                        type:'string',
                                        example:'Internal Server Error'
                                    }
                                }
                            }
                        }
                    }
                }
            }, 
            security:[
                { 
                bearerAuth:[]
                }
            ]
        },
    }
}

export { notifications };