import { Document, Model } from 'mongoose';
import {  TaxInfoRepository as TaxInfoConfig } from '../../../domain/taxInfo/TaxInfoRepository';
import { MongoRepository } from '../MongoRepository';
import { storeHouseEntity } from '../../../domain/storehouse/storeHouseEntity';
import TaxInfoModel from '../../models/taxInfo/TaxInfoModel'



export class TaxInfoRepository extends MongoRepository implements  TaxInfoConfig {
  
    constructor(protected TaxInfoModel: Model<any>) {
      super (TaxInfoModel)
    }  
   
  }