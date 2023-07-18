import { Schema } from 'mongoose';

export interface IService {
    name             :   string;
    description      :   string;
    service_id       :   Schema.Types.ObjectId;
    price            :   number;
    status           :   boolean;
    createdAt       ?:   NativeDate;
    updatedAt       ?:   NativeDate;
}
export interface TypeCarEntity {
    name             :   string;
    services         ?:   IService[];
    status           ?:   boolean;
    typeCar_image    :   any;
    createdAt       ?:   NativeDate;
    updatedAt       ?:   NativeDate;
}