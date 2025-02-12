import { Router } from 'express';
import { ActivityLogRepository } from '../../repository/activityLog/ActivityLogRepository';
import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';
import { ActivityLog } from '../../models/activityLog/ActivityLogModel';
import { ActivityLogUseCase } from '../../../application/activityLog/ActivityLogUseCase';
import { ActivityLogController } from '../../controllers/activityLogController/ActivityLogController';

const activityLogRouter = Router();

const activityLogRepository     = new ActivityLogRepository(ActivityLog);
const activityLogUseCase   = new ActivityLogUseCase(activityLogRepository)
const activityLoController  = new ActivityLogController(activityLogUseCase)
const userValidations = new UserValidations();


activityLogRouter

.get('/all-activity',userValidations.authTypeUserValidation(['SUPER-ADMIN']), activityLoController.getAllActivity )

export default activityLogRouter;