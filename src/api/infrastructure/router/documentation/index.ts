import { Router } from 'express';
import { DocumentationRepository } from '../../repository/documentation/DocumentationRepository';
import { DocumentationUseCase } from '../../../application/documentation/DocumentationUseCase';
import { DocumentationController } from '../../controllers/documentation/DocumentationController';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import DocumentationModel from '../../models/DocumentationModel';
import { DocumentationValidations } from '../../../../shared/infrastructure/validation/Documentation/DocumentationValidation';
import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';


const documentationRouter = Router();

const documentationRepository    = new DocumentationRepository(DocumentationModel);
const documentationUseCase      = new DocumentationUseCase (documentationRepository);
const s3Service          = new S3Service();
const documentationValidations = new DocumentationValidations();  
const documentationController   = new DocumentationController(documentationUseCase, s3Service);
const userValidations = new UserValidations();

documentationRouter

    .get('/', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53']), documentationController.getAllDocumentations)
    .get('/:id', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53']), documentationController.getDocumentationDetail)
    .get('/customer/:id', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53']), documentationController.getAllDocumentationsByCustomer)
    .post('/',documentationValidations.DocumentationFileValidation, documentationController.createDocumentation)
    .post('/validate', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53','65a8193ae6f31eef3013bc57']), documentationValidations.DocumentationFileValidation,documentationController.validateDocumentation)
    .post('/:id',userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53', '65a8193ae6f31eef3013bc57']), documentationValidations.DocumentationFileValidation, documentationController.updateDocumentation)
    .delete('/:id', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53', '65a8193ae6f31eef3013bc57']), documentationController.deleteDocumentation)
    

export default documentationRouter;

