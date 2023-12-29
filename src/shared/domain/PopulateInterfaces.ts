import ProductModel from '../../api/infrastructure/models/ProductModel';
export interface IAuthPopulateConfig {
    path    : string;
    select  : string;

}

export interface ICarServicePopulateConfig {
    path    : string;
    select  : string;
}
export interface IStockPopulateConfig {
    path : string;
    select : string[];
    model : any
    
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

export const stockBranchPopulateConfig : IStockPopulateConfig ={
    path: 'product_id',
    select: ["name", "price","description" ],
    model: ProductModel
}