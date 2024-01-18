import ProductModel from '../../api/infrastructure/models/ProductModel';
import CategoryModel from '../../api/infrastructure/models/CategoryModel';
import SubCategoryModel from '../../api/infrastructure/models/SubCategoryModel';
export interface IAuthPopulateConfig {
    path    : string;
    select  : string;
}
export interface IUserPopulateConfig {
    path    : string;
    select  : string[];
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

export const SubCategoriesPopulateConfig : IStockPopulateConfig ={
    path: '_id',
    select: ["name", "subCategory_image", "_id", ],
    model: SubCategoryModel
}
export const UserPopulateConfig : IUserPopulateConfig ={
    path: 'type_user',
    select: ["name", "type" ],
}