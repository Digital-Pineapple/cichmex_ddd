import { Router } from 'express';
import { BannerRepository } from '../../repository/banners/BannerRepository';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';
import BannerModel from '../../models/banners/BannerModel';
import { BannerUseCase } from '../../../application/Banners/BannerUseCase';
import { BannerController } from '../../controllers/banners/BannerController';
import { BannerValidations } from '../../../../shared/infrastructure/validation/Banner/BannerValidations';
import { ActivityLogger } from '../../../../shared/infrastructure/middleware/ActivityLogger';

const bannerRouter = Router();

const bannerRepository     = new BannerRepository(BannerModel);
const bannerUseCase   = new BannerUseCase(bannerRepository)

const s3Service        = new S3Service()
const bannerController     = new BannerController(bannerUseCase, s3Service);
const userValidations = new UserValidations();
const bannerValidations = new BannerValidations();


bannerRouter

.get('/active', ActivityLogger, bannerController.getActiveBanners)
.get('/', userValidations.authTypeUserValidation(['SUPER-ADMIN','ADMIN']), bannerController.getAllBanners)
.get('/:id', userValidations.authTypeUserValidation(['SUPER-ADMIN','ADMIN']), bannerController.getOneBanner)
.post('/create/addBanner',userValidations.authTypeUserValidation(['SUPER-ADMIN','ADMIN']) , ActivityLogger, bannerValidations.ImagesValidation,  bannerController.createOneBanner)
.put('/change_active/:id',userValidations.authTypeUserValidation(['SUPER-ADMIN','ADMIN']), ActivityLogger,  bannerController.onActiveBanner)
.put('/update/ok/:id',userValidations.authTypeUserValidation(['SUPER-ADMIN','ADMIN']), ActivityLogger, bannerValidations.ImagesValidation, bannerController.updateOneBanner)
.delete('/delete/:id',userValidations.authTypeUserValidation(['SUPER-ADMIN','ADMIN']), ActivityLogger,  bannerController.deleteBanner)

export default bannerRouter;