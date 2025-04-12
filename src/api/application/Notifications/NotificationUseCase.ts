import mongoose from 'mongoose';
import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { socketService } from '../../../shared/infrastructure/socket/socketIOService';
import { INotification } from '../../domain/notification/NotificationEntity';
import { NotificationRepository } from '../../domain/notification/NotificationRepository';
import { UserRepository } from '../../infrastructure/repository/user/UserRepository';
import { TypeUserRepository } from '../../domain/typeUser/TypeUserRepository';

// Caso de uso para manejar la lógica de negocio de notificaciones
export class NotificationUseCase {

    constructor(private notificationRepository: NotificationRepository, private userRepository: UserRepository, private typeUserRepository: TypeUserRepository) {
    }

    // Obtener notificaciones por ID de usuario
    async getByUserId(id: any): Promise<INotification[] |  ErrorHandler |  null> {                        
        const notifications = await this.notificationRepository.findByUser(id)
        return notifications;            
    }

    // Obtener todas las notificaciones
    async getAll(): Promise<INotification[] |  ErrorHandler |  null> {
        return await this.notificationRepository.findAll();
    }

    // Obtener una notificación por ID
    async getOne(id: string): Promise<INotification |  ErrorHandler |  null> {
        return await this.notificationRepository.findById(id);
    }

    // Crear una nueva notificación
    async create(notificationData: INotification): Promise<INotification | ErrorHandler | null> {
        return await this.notificationRepository.create(notificationData);
    }
              
    // Eliminar una notificación (cambiar su estado a inactivo)
    async delete(id: string): Promise<void> {
        return await this.notificationRepository.updateOne(id, {status:false})
    }

    // Marcar una notificación como leída
    async markAsRead(id: any, user_id: any | undefined): Promise<INotification | null> {
        const notification: any | null = await  this.notificationRepository.findOneItem({_id: id, user_id: user_id })
        return await this.notificationRepository.updateOne(notification?._id, {readed: true});
    }

    // Marcar todas las notificaciones como leídas para un usuario
    async markAllAsReaded(user_id: any | undefined): Promise<any | null>{
        const notificationsUpdated = await this.notificationRepository.markAllAsReaded(user_id);
        return notificationsUpdated;
    }

    // Enviar notificaciones a usuarios específicos
    async sendNotificationToUsers(systems: string[], role: string[], payload: any): Promise<void>{
        try{
            const roleId = "66900e97f68b156def9f4a27"; // ID del rol
            const users : any | null= await this.userRepository.findUsersBy({
                type_user: { $in: [roleId, new mongoose.Types.ObjectId(roleId)] }
            });
            await Promise.all(users.map(async (user:any) => {
               const notification =  await this.notificationRepository.create({
                   ...payload,
                   user_id: user._id
               });
               socketService.emitToAdminUserChannel(user._id.toString(), "received_notification", notification);
               return notification;
             }
            ));
        }catch(error){
            console.log("error in use case notification", error);
        }
    }  
}
