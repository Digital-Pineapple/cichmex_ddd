import { model } from 'mongoose';
import BranchOfficeModel from '../../api/infrastructure/models/BranchOffices/BranchOfficeModel';
import CategoryModel from '../../api/infrastructure/models/CategoryModel';
import MembershipBenefitsModel from '../../api/infrastructure/models/Memberships/MembershipBenefitsModel';
import MembershipModel from '../../api/infrastructure/models/Memberships/MembershipModel';
import ProductModel from '../../api/infrastructure/models/products/ProductModel';
import ServiceModel from '../../api/infrastructure/models/ServicesModel';
import SubCategoryModel from '../../api/infrastructure/models/SubCategoryModel';
import UserModel from '../../api/infrastructure/models/UserModel';
import PaymentModel from '../../api/infrastructure/models/payments/PaymentModel';
import StockStoreHouseModel from '../../api/infrastructure/models/stockStoreHouse/StockStoreHouseModel';
import RegionModel from '../../api/infrastructure/models/Regions/RegionModel';
import SizeGuideModel from '../../api/infrastructure/models/sizeGuide/SizeGuideModel';
import { VariantProductModel } from '../../api/infrastructure/models/variantProduct/VariantProductModel';
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
export interface IModelConfig {
    path : string;
    select : string[];
    model : any  
}

export interface IGuideConfig{
    path : string;
    // select : string[];
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
export const typeCarMembershipPopulateConfing: ICarServicePopulateConfig= {
    path: 'type_cars',
    select: 'name',
}
export const ServicesMembershipPopulateConfing: IStockPopulateConfig= {
    path: `service_quantity.service_id`,
    select: ['name','description'],
    model: ServiceModel
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
export const TypeUserPopulateConfig : IUserPopulateConfig ={
    path: 'type_user',
    select: ["system", "role"],
  
}
export const PhonePopulateConfig : IUserPopulateConfig ={
    path: 'phone_id',
    select: ["phone_number", "prefix", "verified" ],
  
}
export const UserPopulateConfig : IUserPopulateConfig ={
    path: 'typeUser',
    select: ['name' ],
}


export const BranchPopulateConfig : IUserPopulateConfig={
    path: 'user_id',
    select: ["fullname",'_id','email'  ],
}

export const validateTypeCarBenefits : IStockPopulateConfig={
    path: 'membership_id',
    select: ["type_cars" ],
    model:MembershipModel
}
export const UserCarBenefits : IStockPopulateConfig={
    path: 'client_id',
    select: ["fullname" ],
    model:UserModel
}
export const ServiceInBenefits : IStockPopulateConfig={
    path: 'service_id',
    select: ["name" ],
    model:ServiceModel
}
export const InfoBranch : IStockPopulateConfig={
    path: 'branch_id',
    select: ["name",'opening_time' ],
    model:BranchOfficeModel
}

export const PopulateProductCS = {
    path: 'products.item',
    model: ProductModel
}

export const PopulateVariantProduct = {
    path: 'products.variant',
    model: VariantProductModel
}

export const PopulateDetailMembership : IStockPopulateConfig={
    path: 'membershipBenefit_id',
    select: ["service_id" ],
    model:MembershipBenefitsModel
}
export const PopulatePointStore : IStockPopulateConfig={
    path: 'store',
    select: ["name", "closing_time", "opening_time", "location" ],
    model: BranchOfficeModel
}
export const PopulateProductCategory : IStockPopulateConfig={
    path: 'category',
    select: ["name"],
    model: CategoryModel
}
export const PopulateProductSubCategory : IStockPopulateConfig={
    path: 'subCategory',
    select: ["name"],
    model: SubCategoryModel
}
export const PopulateMembershipInSC : IStockPopulateConfig={
    path: 'memberships',
    select: ["name", "discount_products"],
    model: MembershipModel
}

export const InfoBranchOrder : IStockPopulateConfig={
    path: 'branch',
    select: ["name",'opening_time', 'closing_time', 'location', "phone_number"],
    model:BranchOfficeModel
}
export const InfoPayment = {
    path: 'payment',
    select: ["MP_info"],
}

export const PopulateInfoUser = {
    path: 'user_id',
    select: ["fullname", "email"],
    model:UserModel
}
export const PopulatePayment = {
    path: 'payment',
    select: ["uuid", "MP_info","payment_status", "verification"],
    model:PaymentModel
}
export const PopulateCategory = {
    path: 'category_id',
    select: ["name"],
    model:CategoryModel
}
export const PopulateRegionUser : IStockPopulateConfig={
    path: 'employee_detail.operationRegions',
    select: ["name","regionCode","type","path"],
    model: RegionModel
}
export const PopulateBranch : IStockPopulateConfig={
    path: 'branch',
    select: ["name","location"],
    model: BranchOfficeModel
}

export const PopulateGuide : IGuideConfig = {
    path: 'size_guide',
    // select: ["*"],
    model: SizeGuideModel    
}


