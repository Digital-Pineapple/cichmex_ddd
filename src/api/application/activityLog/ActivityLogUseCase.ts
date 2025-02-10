import { ActivityLogRepository } from '../../domain/activityLog/ActivityLogRepository';
import { IActivityLog } from '../../domain/activityLog/ActivityLogEntity';


export class ActivityLogUseCase {

    constructor(private readonly activityLogRepository: ActivityLogRepository) { }

    public async getAllActivity(): Promise<IActivityLog[]  | null> {
        return await this.activityLogRepository.findAllItems({})
    }

}