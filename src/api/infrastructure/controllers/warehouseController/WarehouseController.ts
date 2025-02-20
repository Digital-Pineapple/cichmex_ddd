import { Request, Response, NextFunction } from 'express';
import { ResponseData } from "../../../../shared/infrastructure/validation/ResponseData";
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { WarehouseUseCase } from '../../../application/warehouse/WarehouseUseCase';
import { promises } from 'nodemailer/lib/xoauth2';

export class WarehouseController extends ResponseData {
    protected path = '/warehouse'

    constructor(private warehouseUseCase: WarehouseUseCase) {
        super();
        this.getAisle = this.getAisle.bind(this);
        this.getAllZones = this.getAllZones.bind(this);
        this.getAllAisles = this.getAllAisles.bind(this);
        this.getAllSections = this.getAllSections.bind(this);
        this.createZone = this.createZone.bind(this);
        this.createAisle = this.createAisle.bind(this);
        this.addMultipleAisles = this.addMultipleAisles.bind(this);
        this.addMultipleSections = this.addMultipleSections.bind(this);
        this.addMultipleProductsToSection = this.addMultipleProductsToSection.bind(this);
    }

    public async getAllZones(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.warehouseUseCase.getAllZones()
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async getAisle(req: Request, res: Response, next: NextFunction) {
        const {id} = req.params
        try {
            const response = await this.warehouseUseCase.getOneAisle(id)
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async getAllAisles(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.warehouseUseCase.getAllAisles()
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async getAllSections(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.warehouseUseCase.getAllSections()
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async createZone(req: Request, res: Response, next: NextFunction) {
        const body = req.body
        try {
            const response = await this.warehouseUseCase.crateZone(body)
            this.invoke(response, 200, res, 'La zona se creó con éxito', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al crear', 500));
        }
    }

    public async createAisle(req: Request, res: Response, next: NextFunction) {
        const body = req.body
        try {
            const response = await this.warehouseUseCase.createAisle(body)
            this.invoke(response, 200, res, 'La zona se creó con éxito', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async addMultipleAisles(req: Request, res: Response, next: NextFunction) {
        const { names, zone } = req.body;    
        try {
            const responses = await Promise.all(
                names.map((name: any) => this.warehouseUseCase.createAisle({ name, zone }))
            );
            this.invoke(responses, 200, res, 'Los pasillos se crearon con éxito', next);
        } catch (error) {
           next(error)
        }
    }

    public async addMultipleSections(req: Request, res: Response, next: NextFunction) {
        const { names, aisle_id } = req.body
        try {
            const aisle = await this.warehouseUseCase.getOneAisle(aisle_id)
            const responses = await Promise.all(
                names.map((name: any) => this.warehouseUseCase.createSection({ name: `${aisle?.name}_${name}`, aisle: aisle_id }))
            );
            this.invoke(responses, 200, res, 'Las secciones se crearon con éxito', next);
        } catch (error) {
           next(error)
        }
    }

    public async addMultipleProductsToSection(
        req: Request,
        res: Response,
        next: NextFunction
      ) {
        const { id } = req.params;
        const { products } = req.body;
      
        try {
            if (!Array.isArray(products)) {
                throw new ErrorHandler("Formato de productos inválido", 400);
              }
      
         
          const productChecks = products.map(async (product) => {
            const sections = await this.warehouseUseCase.getProductInSection(product.product);
            
            if ( Array.isArray(sections) && sections?.length > 0) {
              const sectionName = sections[0]?.name || 'Desconocida';
              const productName = sections[0]?.productDetails?.[0]?.name || 'Sin nombre';
              throw new ErrorHandler(
                `El producto ${productName} ya está en la sección: ${sectionName}`,
                400
              );
            }
          });
      
          await Promise.all(productChecks);
      
          // 3. Validación de stock
          const section = await this.warehouseUseCase.getOneSection(id);
          if (!section?.stock) {
            throw new ErrorHandler("Sección no encontrada", 404);
          }
      
          // 4. Transacción (depende de tu ORM/DB)
          const result = await this.warehouseUseCase.addProductsToSection(
            id,
            { ...section.stock, ...products }
          );
      
          // 5. Respuesta
          this.invoke(
            result,
            201, // Más apropiado para creación
            res,
            'Productos agregados exitosamente',
            next
          );
      
        } catch (error) {
          next(error);
        }
      }
    
    
   

}