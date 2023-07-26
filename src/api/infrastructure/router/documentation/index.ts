import { Router } from 'express';
import { DocumentationRepository } from '../../repository/documentation/DocumentationRepository';
import { DocumentationUseCase } from '../../../application/documentation/DocumentationUseCase';
import { DocumentationController } from '../../controllers/documentation/DocumentationController';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import DocumentationModel from '../../models/DocumentationModel';
import { DocumentationValidations } from '../../../../shared/infrastructure/validation/Documentation/DocumentationValidation';


const documentationRouter = Router();

const documentationRepository    = new DocumentationRepository(DocumentationModel);
const documentationUseCase      = new DocumentationUseCase (documentationRepository);
const s3Service          = new S3Service();
const documentationValidations = new DocumentationValidations();  
const documentationController   = new DocumentationController(documentationUseCase, s3Service);

documentationRouter

    .get('/', documentationController.getAllDocumentations)
    .get('/:id', documentationController.getDocumentationDetail)
    .get('/documentation/:customer_id', documentationController.getAllDocumentationsByCustomer)
    .post('/',documentationValidations.DocumentationFileValidation, documentationController.createDocumentation)
    .put('/:id',documentationValidations.DocumentationFileValidation, documentationController.updateDocumentation)
    .delete('/:id', documentationController.deleteDocumentation)
    

export default documentationRouter;

