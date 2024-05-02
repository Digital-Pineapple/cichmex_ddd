import { Document, Model } from 'mongoose';
import {  storeHouseRepository as SoreHouseConfig } from '../../../domain/storehouse/storeHouseRepository';
import { MongoRepository } from '../MongoRepository';
import { storeHouseEntity } from '../../../domain/storehouse/storeHouseEntity';
import {StoreHouseModel} from '../../models/storeHouse/StoreHouseModel'



export class StoreHouseRepository extends MongoRepository implements  SoreHouseConfig {
  
    constructor(protected StoreHouseModel: Model<any>) {
      super (StoreHouseModel)
    }
  
    public async createOneStoreHouse(body: object): Promise<storeHouseEntity> {

        const newObject = new this.StoreHouseModel(body);
        await newObject.save();
        return newObject;
    
      }

      public async getAllStoreHouses(populateConfig1: any, populateConfig2: any): Promise<storeHouseEntity[] | null >  {

        return await this.StoreHouseModel.find({status:true})
       
    
      }
  
  
   
  }
  
  