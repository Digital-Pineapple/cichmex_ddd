import { ObjectId } from "mongoose";

export interface RegionEntity {
  _id: ObjectId,
  name: string,
  regionCode: string,
  type: 'Polygon' | 'Circle' | 'Rectangle',
  path?: Array<{ lat: number; lng: number }>
  radius?: number;
  center?: { lat: number; lng: number };
  status: boolean,
  createdAt: NativeDate;
  updatedAt: NativeDate;

}
