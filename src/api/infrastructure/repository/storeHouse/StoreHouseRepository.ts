import { Document, Model } from 'mongoose';
import {  storeHouseRepository as SoreHouseConfig } from '../../../domain/storehouse/storeHouseRepository';
import { MongoRepository } from '../MongoRepository';
import { storeHouseEntity } from '../../../domain/storehouse/storeHouseEntity';



export class StoreHouseRepository extends MongoRepository implements  SoreHouseConfig {
  
    constructor(protected StoreHouseModel: Model<any>) {
      super (StoreHouseModel)
    }
  
    public async createOneStoreHouse(body: object): Promise<storeHouseEntity> {

        const newObject = new this.StoreHouseModel(body);
        await newObject.save();
        return newObject;
    
      }
  
   
  }
  
  