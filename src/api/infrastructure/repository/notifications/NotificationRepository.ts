import { NotificationRepository as NotificationsConfig } from './../../../domain/notification/NotificationRepository';
import { INotification } from './../../../domain/notification/NotificationEntity';
import { MongoRepository } from '../MongoRepository';
import { Model } from 'mongoose';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';

export class NotificationRepository extends MongoRepository implements NotificationsConfig  {

    constructor(protected NotificationModel: Model<any>) {
        super(NotificationModel)
    }
    
    async findAll() {
        return await this.NotificationModel.find({});
    }

    async findById(id: string) {
        return await this.NotificationModel.findOne({ _id:id });
    }

    async create(notificationData: any) {
        return await this.NotificationModel.create(notificationData);
    }
    async update(id: string, data: INotification): Promise<INotification | ErrorHandler | null> {
        return await this.NotificationModel.findOneAndUpdate({ _id: id }, { ...data }, { new: true });
    }
    async findByUser(id: any): Promise<INotification[] | ErrorHandler | null> {                
        return await this.NotificationModel.find({user_id: id}).sort({ createdAt: -1 }); 
    }
    async markAllAsReaded(user_id: any): Promise<any | ErrorHandler | null> {                        
        const result =  await this.NotificationModel.updateMany({user_id: user_id}, { $set: { readed: true }});            
        return result;
    }
    

  
}
