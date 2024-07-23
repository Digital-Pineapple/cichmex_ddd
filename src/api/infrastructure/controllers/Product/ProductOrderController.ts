import { S3Service } from './../../../../shared/infrastructure/aws/S3Service';
import { Request, Response, NextFunction, response } from 'express';
import { ErrorHandler } from "../../../../shared/domain/ErrorHandler";
import { ResponseData } from "../../../../shared/infrastructure/validation/ResponseData";
import { ProductOrderUseCase } from '../../../application/product/productOrderUseCase';
import { ProductOrderEntity } from '../../../domain/product/ProductEntity';

export class ProductOrderController extends ResponseData {
  protected path = "/productOrder";

  constructor(
    private productOrderUseCase: ProductOrderUseCase,
    private readonly s3Service: S3Service
  ) {
    super();
    this.getAllProductOrders = this.getAllProductOrders.bind(this);
    this.gerProductOrderResume = this.gerProductOrderResume.bind(this);
    this.getOneProductOrder = this.getOneProductOrder.bind(this);
    this.getOneProductOrderByUser = this.getOneProductOrderByUser.bind(this);
    this.createProductOrder = this.createProductOrder.bind(this);
    this.updateProductOrder = this.updateProductOrder.bind(this);
    this.deleteProductOrder = this.deleteProductOrder.bind(this);
    this.fillProductOrder  = this.fillProductOrder.bind(this);

  }

  public async getAllProductOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.productOrderUseCase.getProductOrders()

      this.invoke(response, 200, res, "", next);
    } catch (error) {
      next(new ErrorHandler("Hubo un error al consultar la información", 500));
    }
  }

  public async gerProductOrderResume(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.productOrderUseCase.getProductOrdersResume()
      this.invoke(response, 200, res, "", next);
    } catch (error) {
      next(new ErrorHandler("Hubo un error al consultar la información", 500));
    }
  }


  public async getOneProductOrder(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const response: any | null = await this.productOrderUseCase.getOneProductOrder(id)  
                 
      this.invoke(response, 200, res, "", next);
    } catch (error) {
      next(new ErrorHandler("Hubo un error al consultar la información", 500));
    }
  }
  public async getOneProductOrderByUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.user;
    
    try {
      const response: any  | null = await this.productOrderUseCase.ProductOrdersByUser(id)    
      this.invoke(response, 200, res, "", next);
    } catch (error) {
      console.log(error);      
      next(new ErrorHandler("Hubo un error al consultar la información", 500));
    }
  }

  public async getProductOrderByBranch(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const response = await this.productOrderUseCase.ProductOrdersByBranch(id)
      this.invoke(response, 200, res, "", next);
    } catch (error) {
      next(new ErrorHandler("Hubo un error al consultar la información", 500));
    }
  }


  public async createProductOrder(req: Request, res: Response, next: NextFunction) {
    const { values } = req.body;
    try {
      const response = await this.productOrderUseCase.createProductOrder({ ...values })
      this.invoke(response, 201, res, 'Creado con éxito', next);
    } catch (error) {
      next(new ErrorHandler('Hubo un error al actualizar', 500));
    }

  }


  public async updateProductOrder(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { values } = req.body;
    try {
      const response = await this.productOrderUseCase.updateProductOrder(id, { ...values })
      this.invoke(response, 201, res, 'Se actualizó con éxito', next);
    } catch (error) {
      next(new ErrorHandler("Hubo un error ", 500));
    }
  }

  public async fillProductOrder(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { storeHouse } = req.body;
    
    try {
      const response = await this.productOrderUseCase.startFillProductOrder(id,{storeHouseStatus :storeHouse})
      this.invoke(response, 201, res, 'Se actualizó con éxito', next);
    } catch (error) {
      
      next(new ErrorHandler("Hubo un error ", 500));
    }
  }

  public async deleteProductOrder(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const response = await this.productOrderUseCase.updateProductOrder(id, { status: false })
      this.invoke(response, 201, res, 'Se eliminó con éxito', next);
    } catch (error) {
      next(new ErrorHandler("Hubo un error ", 500));
    }
  }



}



