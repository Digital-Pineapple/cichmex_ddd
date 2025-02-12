import { ActivityLogRepository as ActivityLogConfig } from './../../../domain/activityLog/ActivityLogRepository';
import { Model } from 'mongoose';
import { MongoRepository } from '../MongoRepository';
import { IActivityLog } from '../../../domain/activityLog/ActivityLogEntity';


export class ActivityLogRepository extends MongoRepository implements ActivityLogConfig  {

    constructor(protected ActivityLogModel : Model<any>) {
        super(ActivityLogModel);
    }

    async getAllACtivityLog(): Promise<IActivityLog[] | null> {
        return await this.ActivityLogModel.find({})
      .sort({ createdAt: -1 })
      .select('-__v'); 
       
    }

   

}