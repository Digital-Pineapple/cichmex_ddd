import { UserEntity } from "../user/UserEntity";

export interface IFile {
    _id: string;
    name: string;
    message?: string;
    user_id?: UserEntity;
    url: string;
    verify: boolean;
    status?: boolean;
}

export interface IRespFile {
    _id ?: string; 
    name: string;
    message?: string;
    verify: boolean;
}