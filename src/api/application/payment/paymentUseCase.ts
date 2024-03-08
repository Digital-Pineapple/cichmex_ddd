import { response } from 'express';
import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { ServicesMembershipPopulateConfing, typeCarMembershipPopulateConfing } from '../../../shared/domain/PopulateInterfaces';
import {  MembershipEntity, MembershipInfoResponse, ServiceQuantity } from '../../domain/membership/MembershipEntity';
import { PaymentRepository } from '../../domain/payments/PaymentRepository'
import PaymentEntity from '../../domain/payments/PaymentEntity';

export class PaymentUseCase {

    constructor(private readonly paymentRepository: PaymentRepository) { }

    public async getPayments(): Promise<PaymentEntity[] | ErrorHandler > {
        return await this.paymentRepository.findAll();
    }

    public async getDetailPayment(_id: string): Promise<PaymentEntity | ErrorHandler | null> {
        return await this.paymentRepository.findById(_id);
    }
    public async getInfoPayment(_id: string): Promise<PaymentEntity | ErrorHandler | null> {
        return  await this.paymentRepository.findById(_id);
          
    } 
    public async createNewPayment(object:any): Promise<PaymentEntity | ErrorHandler | null> {
        
        return await this.paymentRepository.createOne(object);
    }

    public async updateOnePayment(_id: string, updated: PaymentEntity): Promise<PaymentEntity> {
        return this.paymentRepository.updateOne(_id, updated);
    }
    public async deleteOnePayment(_id: string): Promise<PaymentEntity | null> {
        return this.paymentRepository.updateOne(_id, {deleted: true})
    }

}