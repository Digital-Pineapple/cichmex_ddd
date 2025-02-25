
import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { INotification } from '../../domain/notification/NotificationEntity';
import { NotificationRepository } from '../../domain/notification/NotificationRepository';
import { UserRepository } from '../../domain/user/UserRepository';


export class NotificationUseCase {

    constructor(private notificationRepository: NotificationRepository, private userRepository: UserRepository) {
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

        // async sendNotificationToUsersWithRoles(roles: Array<any>, payload: INotification): Promise<INotification[] | null>{
        //     const users : any | null= await this.userRepository.findByRoles(roles);
        //     const notifications = await Promise.all(users.map(async (user:any) => {
        //        const notification =  await this.notificationRepository.create({
        //            ...payload,
        //            user_id: user._id
        //        });
        //        return notification;
        //      }
        //     ));
        //     return notifications
        // }  
}
