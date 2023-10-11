export interface IAuthPopulateConfig {
    path    : string;
    select  : string;
}

export interface ICarServicePopulateConfig {
    path    : string;
    select  : string;
}

export const authPopulateConfing: IAuthPopulateConfig = {
    path: 'type_customer',
    select: 'name',
}

export const nameCarPopulateConfing: IAuthPopulateConfig = {
path: 'typeCar_id',
select: 'name',
}

export const typeCarPopulateConfing: ICarServicePopulateConfig= {
    path: '_id',
    select: 'name',
}