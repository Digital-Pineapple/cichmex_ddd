import { ErrorHandler } from "../../../shared/domain/ErrorHandler"
import { MongoRepository } from "../../infrastructure/repository/MongoRepository"
import { INotification } from "./NotificationEntity"

export interface NotificationRepository extends MongoRepository {
    findAll(): Promise<INotification[]| ErrorHandler | null>
    create(data: INotification): Promise<INotification | ErrorHandler | null>
    update(id: string, data: INotification): Promise<INotification | ErrorHandler | null>
    findById(id: string) : Promise<INotification | ErrorHandler | null>
    findByUser(id: any) : Promise<INotification[] | ErrorHandler | null>
    markAllAsReaded(user_id: any) : Promise<any | ErrorHandler | null>

    
    

}