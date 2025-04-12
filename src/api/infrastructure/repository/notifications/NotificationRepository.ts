import { NotificationRepository as NotificationsConfig } from './../../../domain/notification/NotificationRepository';
import { INotification } from './../../../domain/notification/NotificationEntity';
import { MongoRepository } from '../MongoRepository';
import { Model } from 'mongoose';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';

// Repositorio para manejar las operaciones de base de datos relacionadas con notificaciones
export class NotificationRepository extends MongoRepository implements NotificationsConfig  {

    constructor(protected NotificationModel: Model<any>) {
        super(NotificationModel)
    }
    
    // Obtener todas las notificaciones
    async findAll() {
        return await this.NotificationModel.find({});
    }

    // Obtener una notificación por ID
    async findById(id: string) {
        return await this.NotificationModel.findOne({ _id:id });
    }

    // Crear una nueva notificación
    async create(notificationData: any) {
        return await this.NotificationModel.create(notificationData);
    }

    // Actualizar una notificación por ID
    async update(id: string, data: INotification): Promise<INotification | ErrorHandler | null> {
        return await this.NotificationModel.findOneAndUpdate({ _id: id }, { ...data }, { new: true });
    }

    // Obtener notificaciones por ID de usuario
    async findByUser(id: any): Promise<INotification[] | ErrorHandler | null> {                
        return await this.NotificationModel.find({user_id: id}).sort({ createdAt: -1 }); 
    }

    // Marcar todas las notificaciones como leídas para un usuario
    async markAllAsReaded(user_id: any): Promise<any | ErrorHandler | null> {                        
        const result =  await this.NotificationModel.updateMany({user_id: user_id}, { $set: { readed: true }});            
        return result;
    }
}
