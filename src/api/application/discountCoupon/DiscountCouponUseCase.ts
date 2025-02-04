import moment from 'moment';
import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { DiscountCouponEntity } from '../../domain/discountCoupon/DiscountCouponEntity';
import { DiscountCouponRepository } from '../../domain/discountCoupon/DiscountCouponRepository'
import { MomentService } from '../../../shared/infrastructure/moment/MomentService';
import { PopulateProductCS, PopulateProducts } from '../../../shared/domain/PopulateInterfaces';

export class DiscountCouponUseCase {

    constructor(private readonly discountCouponRepository: DiscountCouponRepository, private readonly momentService: MomentService) { }

    public async findAllDiscountCoupons(): Promise<DiscountCouponEntity[] | ErrorHandler | null> {
        return await this.discountCouponRepository.findAll(PopulateProducts)
    }

    public async getOneDiscountDetails(_id: string): Promise<DiscountCouponEntity[] | ErrorHandler | null> {
        return await this.discountCouponRepository.findById(_id, PopulateProducts)
    }
    public async findOneDiscountCoupon(code: string): Promise<DiscountCouponEntity | ErrorHandler | null> {
        const coupon = await this.discountCouponRepository.findOneItem({ code: code });

        if (!coupon) {
            return new ErrorHandler('Cupón no encontrado', 404);
        }

        const expiration = this.momentService.verifyExpirationDate(coupon.expiration_date);

        if (expiration) {
            return new ErrorHandler('Cupón expirado', 500);
        }

        // Acceder a los datos del objeto real
        const couponData = coupon._doc;

        // Crear una copia del objeto sin la propiedad uuid
        const { createdAt, updatedAt, ...couponW } = couponData;

        return couponW;
    }
    public async findOneDiscountCouponByUuid(uuid: string): Promise<DiscountCouponEntity | ErrorHandler | null> {
        const coupon = await this.discountCouponRepository.findOneItem({ uuid: uuid });
        if (!coupon) {
            return new ErrorHandler('Cupón no encontrado', 404);
        }
        const expiration = this.momentService.verifyExpirationDate(coupon.expiration_date);

        if (expiration) {
            return new ErrorHandler('Cupón expirado', 500);
        }
        // Acceder a los datos del objeto real
        const couponData = coupon._doc;

        // Crear una copia del objeto sin la propiedad uuid
        const { createdAt, updatedAt, ...couponW } = couponData;

        return couponW;
    }


    public async createDiscountCoupon(body: any): Promise<DiscountCouponEntity | ErrorHandler | null> {

        return await this.discountCouponRepository.createOne({ ...body })
    }
    public async updateDiscountCoupon(id: string, updated: any): Promise<DiscountCouponEntity | ErrorHandler | null> {

        return await this.discountCouponRepository.updateOne(id, { ...updated })
    }
    public async deleteDiscountCoupon(id: string): Promise<DiscountCouponEntity | ErrorHandler | null> {

        return await this.discountCouponRepository.updateOne(id, { status: false })
    }

}