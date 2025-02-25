import { Request, Response, NextFunction } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { NotificationUseCase } from '../../../application/Notifications/NotificationUseCase';

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

    

    

     
}
