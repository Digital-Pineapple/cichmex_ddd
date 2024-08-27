import { ObjectId } from "mongoose";

export interface DynamicRouteEntity {
    _id: ObjectId;
    uuid: string,
    name: string;
    path: string;
    component:  number;
    layout: string;
    authRequired: boolean;
    rolesAllowed:  string[];
    redirectTo: string;
    system:string;
    status?: boolean;
}