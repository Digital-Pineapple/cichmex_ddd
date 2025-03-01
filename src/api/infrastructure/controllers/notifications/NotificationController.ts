import { Request, Response, NextFunction } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { NotificationUseCase } from '../../../application/Notifications/NotificationUseCase';
import { socketService } from '../../../../shared/infrastructure/socket/socketIOService';

export class NotificationController extends ResponseData {
    protected path = '/notification';

    constructor( 
        private readonly notificationUseCase: NotificationUseCase,                
    ) {
        super();
        this.getByUser = this.getByUser.bind(this); 
        this.create= this.create.bind(this);     
        this.markAsRead = this.markAsRead.bind(this); 
        this.delete = this.delete.bind(this);
        this.markAllAsReaded = this.markAllAsReaded.bind(this);
        this.sendEvent = this.sendEvent.bind(this);
    }
   public async getByUser(req: Request, res: Response, next: NextFunction){         
        const user = req.user;    
        try{                                
            const notifications = await this.notificationUseCase.getByUserId(user?._id);                    
            this.invoke(notifications, 200, res,'', next);
        }catch(error){
            console.log( "notifications",error);        
            next(new ErrorHandler('Error al obtener las notificaiones del usuario', 500));
        }
   }
   public async create(req: Request, res: Response, next: NextFunction){
        const { notificationP } = req.body;                          
        try{        
            const notification = await this.notificationUseCase.create(notificationP);
            this.invoke(notification, 201, res,'', next);
        }catch(error){
            console.log( "notifications",error);        
            next(new ErrorHandler(`${(error as any).message || "Error al crear la notificación"}`, 500));
        }
    }
    public async markAsRead(req: Request, res: Response, next: NextFunction){      
        const { id } = req.params;      
        const user = req.user;
        try{                    
            const notification = await this.notificationUseCase.markAsRead(id, user?._id);
            this.invoke(notification, 200, res,'', next);
        }catch(error){
            console.log( "notifications",error);        
            next(new ErrorHandler('Error al obtener las notificaiones del usuario', 500));
        }
    }
    public async delete(req: Request, res: Response, next: NextFunction){  
        const { id } = req.params;             
        try{        
            const notification = await this.notificationUseCase.delete(id); 
            this.invoke(notification, 200, res,'', next);
        }catch(error){
            console.log( "notifications",error);        
            next(new ErrorHandler('Error al elim', 500));
        }
    }
    
    public async markAllAsReaded(req: Request, res: Response, next: NextFunction){
        const user = req.user;
        try{
            await this.notificationUseCase.markAllAsReaded(user?._id);
            this.invoke({}, 204, res,'', next);            
        }catch(error){
            // console.log("the error is", error);            
            next(new ErrorHandler(`${(error as any).message || "Error al editar"}`, 500));
        }
    }

    public async sendEvent(req: Request, res: Response, next: NextFunction){  
        // console.log("hi from socket event");              
        try{  
            // socketService.emitToAdminUserChannel("6750a44897442e7b71f06e5f", "received_notification", {
            //     "_id" : "67be24af34ee0cf2e3e8eca5",
            //     "from" : "6750a44897442e7b71f06e55",
            //     "channel" : "inApp",
            //     "message" : "Este es un mensaje de socket io",
            //     "type" : "promotion",
            //     "user_id" : "6750a44897442e7b71f06e55",
            //     "readed" : true,
            //     "status" : true,
            //     "createdAt" : "2025-02-25T20:14:39.053+0000",
            //     "updatedAt" : "2025-02-25T22:04:36.415+0000",
            //     "random": Date()
            // })
            // await this.notificationUseCase.sendNotificationToUsers(["CICHMEX", "CARWASH"], ["SUPER-ADMIN"],  {                                                      
            //     "from" : "6750a44897442e7b71f06e55",                            
            //     "message" : "Se ha creado un nuevo pedido",
            //     "type" : "order", 
            //     "resource_id": "6750a44897442e7b71f06e55",                                                                                                                                                                                          
            // })            
        
            this.invoke({ok:true}, 200, res,'', next);            
        }catch(error){
            // console.log("the error is", error);            
            next(new ErrorHandler(`${(error as any).message || "Error al editar"}`, 500));
        }
    }

    

    

     
}
