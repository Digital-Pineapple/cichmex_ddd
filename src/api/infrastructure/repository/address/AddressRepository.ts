import { response } from 'express';
import { AddressRepository as AddressConfig } from './../../../domain/adresses/AddressRepository';
import { Model } from 'mongoose';
import { MongoRepository } from '../MongoRepository';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { AddressEntity } from '../../../domain/adresses/AddressEntity';


export class AddressRepository extends MongoRepository implements AddressConfig  {

    constructor(protected AddressModel : Model<any>) {
        super(AddressModel);
    }

    async findAddressesByUser(_id: string): Promise<AddressEntity[] | null> {
        const response: any = await this.AddressModel.find({ user_id: _id, status: true }).sort({ createdAt: -1 })
        return response
    }

    async createOneAddress(_id: string, body: object): Promise<AddressEntity | null> {
      const response: any = await this.AddressModel.create({user_id: _id, ...body})
      return response;      
    }
    async updateOneAddress(_id: string, body: object): Promise<AddressEntity | null> {
      const response: any = await this.AddressModel.findOneAndUpdate({ _id: _id }, { ...body }, { new: true })
      return response;      
    }
    async deleteOneAddress(_id: string): Promise<AddressEntity | null> {
      const response: any = await this.AddressModel.findOneAndUpdate({ _id: _id }, { status: false }, { new: true })
      return response;         
    }

   

}