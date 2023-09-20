import { CustomerEntity } from '../../src/api/domain/customer/CustomerEntity';
import { UserEntity } from '../../src/api/domain/user/UserEntity';
import { DocumentationEntity } from '../../src/api/domain/documentation/DocumentationsEntity'
import { CarDetail } from '../../src/api/domain/carDetail/CarDetailEntity'

export { }

declare global {
    namespace Express {
        export interface Request {
            user : CustomerEntity | UserEntity,
            files: File[],
            carDetail : CarDetailEntity,
            
        }
    }
}