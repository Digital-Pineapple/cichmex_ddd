import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { ServicesMembershipPopulateConfing, typeCarMembershipPopulateConfing } from '../../../shared/domain/PopulateInterfaces';
import {  MembershipEntity, ServiceQuantity } from '../../domain/membership/MembershipEntity';
import { MembershipRepository } from '../../domain/membership/MembershipRepository'

export class MembershipUseCase {

    constructor(private readonly membershipRepository: MembershipRepository) { }

    public async getMemberships(): Promise<MembershipEntity[] | ErrorHandler > {
        return await this.membershipRepository.findAll(typeCarMembershipPopulateConfing, ServicesMembershipPopulateConfing);
    }

    public async getDetailMembership(_id: string): Promise<MembershipEntity | ErrorHandler | null> {
        return await this.membershipRepository.findById(_id);
    }

    public async createNewMembership(name: string, price_standard : number,discount_porcent?:number, discount_products?:number, price_discount?: number, service_quantity?:[ServiceQuantity], type_cars?:[string] ): Promise<MembershipEntity | ErrorHandler | null> {
        const membership = await this.membershipRepository.findOneItem({name});
        if (membership) return new ErrorHandler('La membresia ya ha sido registrada',400);
        return await this.membershipRepository.createOne({ name,price_standard,discount_porcent,discount_products, price_discount,service_quantity, type_cars });
    }

    public async updateOneMembership(_id: string,updated: any): Promise<MembershipEntity> {
        return await this.membershipRepository.updateOne(_id,updated);
    }
    public async deleteOneMembership(_id: string): Promise<MembershipEntity | null> {
        return this.membershipRepository.updateOne(_id, {deleted: true})
    }

}