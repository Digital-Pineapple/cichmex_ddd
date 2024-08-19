import { Model } from 'mongoose';
import {  SoketRepository as SocketRepositoryConfig } from '../../../domain/socket/socketRepository';
import { MongoRepository } from '../MongoRepository';



export class SocketsRepository extends MongoRepository implements  SocketRepositoryConfig {
  
    constructor(protected SocketUser: Model<any>) {
      super (SocketUser)
    }
  
    // async getAllStockInBranch(branchId: string): Promise<any[]> {
    //   return await this.findStockByBranch(`branch_id : ${branchId}`);
    // }
  
  }