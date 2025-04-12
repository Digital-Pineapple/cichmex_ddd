import { Request, Response, NextFunction } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { NotificationUseCase } from '../../../application/Notifications/NotificationUseCase';
import { socketService } from '../../../../shared/infrastructure/socket/socketIOService';

// Controlador para manejar las notificaciones
export class NotificationController extends ResponseData {
    protected path = '/notification'; // Ruta base para las notificaciones

    constructor( 
        private readonly notificationUseCase: NotificationUseCase, // Caso de uso para manejar la lógica de negocio de notificaciones
    ) {
        super();
        this.getByUser = this.getByUser.bind(this); // Método para obtener notificaciones por usuario
        this.create= this.create.bind(this); // Método para crear una notificación
        this.markAsRead = this.markAsRead.bind(this); // Método para marcar una notificación como leída
        this.delete = this.delete.bind(this); // Método para eliminar una notificación
        this.markAllAsReaded = this.markAllAsReaded.bind(this); // Método para marcar todas las notificaciones como leídas
        this.sendEvent = this.sendEvent.bind(this); // Método para enviar eventos relacionados con notificaciones
    }

    // Obtener notificaciones por usuario
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

    // Crear una nueva notificación
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

    // Marcar una notificación como leída
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

    // Eliminar una notificación
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
    
    // Marcar todas las notificaciones como leídas
    public async markAllAsReaded(req: Request, res: Response, next: NextFunction){
        const user = req.user;
        try{
            await this.notificationUseCase.markAllAsReaded(user?._id);
            this.invoke({}, 204, res,'', next);            
        }catch(error){
            next(new ErrorHandler(`${(error as any).message || "Error al editar"}`, 500));
        }
    }

    // Enviar un evento relacionado con notificaciones
    public async sendEvent(req: Request, res: Response, next: NextFunction){                
        try{  
            this.invoke({ok:true}, 200, res,'', next);            
        }catch(error){
            next(new ErrorHandler(`${(error as any).message || "Error al editar"}`, 500));
        }
    }
}
