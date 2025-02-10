import { Request, Response, NextFunction } from 'express';
import { ActivityLog } from '../../../api/infrastructure/models/activityLog/ActivityLogModel';


export const ActivityLogger = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req,'data');
  

  try {
    const logData: any = {
      userId: req.user ? req.user.id : null,
      action: `${req.method} ${req.path}`,
      ipAddress: req.ip,
      details: {
        body: req.body,
        params: req.params
      },
      status: 'pending'  
    };

    const logEntry = await ActivityLog.create(logData);

    res.on('finish', async () => {
      logEntry.status = res.statusCode >= 400 ? 'failed' : 'success';
      await logEntry.save();
    });

    next();
  } catch (error) {
    console.error('Error logging activity:', error);
    next();
  }
};
