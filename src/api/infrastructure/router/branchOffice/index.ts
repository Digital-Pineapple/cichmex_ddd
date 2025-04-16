import { Router } from 'express';
import { BranchOfficeUseCase } from '../../../application/branchOffice/BranchOfficeUseCase';
import { DocumentationUseCase } from '../../../application/documentation/DocumentationUseCase';

import { BranchOfficeController } from '../../controllers/branchOffice/BranchOfficeController';
import { BranchOfficeRepository } from '../../repository/branch_office/BranchOfficeRepository';
import { DocumentationRepository } from '../../repository/documentation/DocumentationRepository';

import BranchOfficeModel from '../../models/BranchOffices/BranchOfficeModel';
import FileModel from '../../models/DocumentationModel';

import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';
import { BranchOfficeValidations } from '../../../../shared/infrastructure/validation/BranchOffice/BranchOfficeValidatios';
import { ProductOrderRepository } from '../../repository/product/ProductOrderRepository';
import ProductOrderModel from '../../models/products/ProductOrderModel';
import { ProductOrderUseCase } from '../../../application/product/productOrderUseCase';
import { ActivityLogger } from '../../../../shared/infrastructure/middleware/ActivityLogger';

// Creación del router para las rutas de la sucursal
const branchOfficeRouter = Router();

// Instanciación de los repositorios
const branchOfficeRepository     = new BranchOfficeRepository(BranchOfficeModel);
const documentationRepository  = new DocumentationRepository(FileModel)
const productOrderRepository  = new ProductOrderRepository(ProductOrderModel)

// Instanciación de los casos de uso
const branchOfficeUseCase  = new BranchOfficeUseCase(branchOfficeRepository)
const documentationUseCase   = new DocumentationUseCase(documentationRepository)
const productOrderUseCase   = new ProductOrderUseCase(productOrderRepository)

// Instanciación del servicio de S3
const s3Service        = new S3Service()
// Instanciación del controlador de la sucursal
const branchOfficeController     = new BranchOfficeController(branchOfficeUseCase, documentationUseCase,productOrderUseCase, s3Service);
// Instanciación de las validaciones
const userValidations = new UserValidations();
const branchValidations = new BranchOfficeValidations()

// Configuración de las rutas
branchOfficeRouter

.get('/',branchOfficeController.getAllBranchOffices) // Obtener todas las sucursales
.get('/info',branchOfficeController.getBranchOfficesInfo) // Obtener información de las sucursales
.get('/:id', branchOfficeController.getBranchOfficeDetail) // Obtener detalles de una sucursal específica
.get('/user/:id', branchOfficeController.getBranchesByUser) // Obtener sucursales por usuario
.post('/',branchValidations.ImageValidation, userValidations.authTypeUserValidation(['SUPER-ADMIN','PARTNER', 'ADMIN']),ActivityLogger,  branchOfficeController.createBranchOffice) // Crear una nueva sucursal
.post('/verify/:id',userValidations.authTypeUserValidation(['SUPER-ADMIN', 'ADMIN']),ActivityLogger, branchOfficeController.verifyBranchOffice) // Verificar una sucursal
.post('/desactivate/:id',userValidations.authTypeUserValidation(['SUPER-ADMIN','ADMIN']),ActivityLogger,branchOfficeController.desactivateBranchOffice) // Desactivar una sucursal
.patch('/:id', branchValidations.ImageValidation,userValidations.authTypeUserValidation(['SUPER-ADMIN','PARTNER', 'ADMIN']), ActivityLogger, branchOfficeController.updateBranchOffice) // Actualizar una sucursal
.delete('/:id',userValidations.authTypeUserValidation(['SUPER-ADMIN','PARTNER', 'ADMIN']),ActivityLogger, branchOfficeController.deleteBranchOffice) // Eliminar una sucursal
.put('/image/:id', userValidations.authTypeUserValidation(['SUPER-ADMIN','PARTNER', 'ADMIN']),ActivityLogger, branchOfficeController.deleteImage) // Eliminar una imagen de una sucursal
.post('/nearLocation', branchOfficeController.getCloserBranches) // Obtener las sucursales más cercanas

export default branchOfficeRouter;