
import mongoose from 'mongoose';
import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { socketService } from '../../../shared/infrastructure/socket/socketIOService';
import { INotification } from '../../domain/notification/NotificationEntity';
import { NotificationRepository } from '../../domain/notification/NotificationRepository';
import { UserRepository } from '../../infrastructure/repository/user/UserRepository';
import { TypeUserRepository } from '../../domain/typeUser/TypeUserRepository';


export class NotificationUseCase {

    constructor(private notificationRepository: NotificationRepository, private userRepository: UserRepository, private typeUserRepository: TypeUserRepository) {
    }

        async getByUserId(id: any): Promise<INotification[] |  ErrorHandler |  null> {                        
            const notifications = await this.notificationRepository.findByUser(id)
            return notifications;            
        }

        async getAll(): Promise<INotification[] |  ErrorHandler |  null> {
            return await this.notificationRepository.findAll();
        }

        async getOne(id: string): Promise<INotification |  ErrorHandler |  null> {
            return await this.notificationRepository.findById(id);
        }

        async create(notificationData: INotification): Promise<INotification | ErrorHandler | null> {
            return await this.notificationRepository.create(notificationData);
        }
              
        async delete(id: string): Promise<void> {
            return await this.notificationRepository.updateOne(id, {status:false})
        }

        async markAsRead(id: any, user_id: any | undefined): Promise<INotification | null> {
            const notification: any | null = await  this.notificationRepository.findOneItem({_id: id, user_id: user_id })
            console.log("the notification for edit is: " + notification);
            
            return await this.notificationRepository.updateOne(notification?._id, {readed: true});
        }

        async markAllAsReaded(user_id: any | undefined): Promise<any | null>{
            const notificationsUpdated = await this.notificationRepository.markAllAsReaded(user_id);
            return notificationsUpdated;
        }

        async sendNotificationToUsers(systems: string[], role: string[], payload: any): Promise<void>{
            try{
                // console.log("notificaciones");                
                // const roleUser = await this.typeUserRepository
                // findOneItem({ system: systems, role: role , status:true})
                // .findOneItem({ system: systems, role: role , status:true});            
                const roleId = "66900e97f68b156def9f4a27"; // Convertir a string
                const users : any | null= await this.userRepository.findUsersBy({
                    type_user: { $in: [roleId, new mongoose.Types.ObjectId(roleId)] }
                });
                // console.log(users);
                // return;
                await Promise.all(users.map(async (user:any) => {
                   const notification =  await this.notificationRepository.create({
                       ...payload,
                       user_id: user._id
                   });
                   socketService.emitToAdminUserChannel(user._id.toString(), "received_notification", notification);
                   return notification;
                 }
                ));
                // return notifications;
            }catch(error){
                console.log("error in use case notification", error);
                // return null;
            }
        }  
}
