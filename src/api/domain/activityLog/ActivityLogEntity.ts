import { Schema } from "mongoose";

export interface IActivityLog extends Document {
    userId: Schema.Types.ObjectId;
    action: string;
    timestamp: Date;
    details: Record<string, unknown>;
    ipAddress?: string;
    resourceId?: string;
    status?: 'success' | 'failed';
  }
  