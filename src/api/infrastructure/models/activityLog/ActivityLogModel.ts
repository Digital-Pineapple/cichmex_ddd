import { model, Model, Schema } from "mongoose";
import { IActivityLog } from "../../../domain/activityLog/ActivityLogEntity";

// Schema de Mongoose
const activityLogSchema = new Schema<IActivityLog>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    details: { type: Schema.Types.Mixed, default: {} },
    ipAddress: String,
    resourceId: String,
    status: String
  });
  
  // Índices
  activityLogSchema.index({ userId: 1 });
  activityLogSchema.index({ timestamp: -1 });
  
  // Modelo TypeScript
  export const ActivityLog: Model<IActivityLog> = model<IActivityLog>(
    'ActivityLog',
    activityLogSchema
  );