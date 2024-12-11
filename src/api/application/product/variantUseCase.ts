import { ObjectId } from "mongoose";
import { ErrorHandler } from "../../../shared/domain/ErrorHandler";
import { PopulateProductCategory, PopulateProductSubCategory } from "../../../shared/domain/PopulateInterfaces";
import { VariantProductRepository } from "../../domain/product/VariantProductRepository";


export class VariantProductUseCase {
  constructor(private readonly variantProductRepository: VariantProductRepository) {}



}
