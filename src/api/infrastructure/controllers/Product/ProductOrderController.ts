import { S3Service } from './../../../../shared/infrastructure/aws/S3Service';
import { Request, Response, NextFunction, response } from 'express';
import { ErrorHandler } from "../../../../shared/domain/ErrorHandler";
import { ResponseData } from "../../../../shared/infrastructure/validation/ResponseData";
import { ProductOrderUseCase } from '../../../application/product/productOrderUseCase';
import { ProductOrderEntity } from '../../../domain/product/ProductEntity';
import moment, { ISO_8601 } from 'moment';

export class ProductOrderController extends ResponseData {
  protected path = "/productOrder";

  constructor(
    private productOrderUseCase: ProductOrderUseCase,
    private readonly s3Service: S3Service
  ) {
    super();
    this.getAllProductOrders = this.getAllProductOrders.bind(this);
    this.paidProductOrders   = this.paidProductOrders.bind(this);
    this.gerProductOrderResume = this.gerProductOrderResume.bind(this);
    this.getOneProductOrder = this.getOneProductOrder.bind(this);
    this.getOneProductOrderByUser = this.getOneProductOrderByUser.bind(this);
    this.createProductOrder = this.createProductOrder.bind(this);
    this.updateProductOrder = this.updateProductOrder.bind(this);
    this.deleteProductOrder = this.deleteProductOrder.bind(this);
    this.fillProductOrder  = this.fillProductOrder.bind(this);
    this.paidAndSupplyPOToPoint = this.paidAndSupplyPOToPoint.bind(this);
    this.paidAndSupplyPO   = this.paidAndSupplyPO.bind(this);
    this.AssignRoute   = this.AssignRoute.bind(this);

  }

  public async getAllProductOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.productOrderUseCase.getProductOrders()

      this.invoke(response, 200, res, "", next);
    } catch (error) {
      next(new ErrorHandler("Hubo un error al consultar la información", 500));
    }
  }

  public async paidProductOrders(req: Request, res: Response, next: NextFunction) {
   
    try {
      const response = await this.productOrderUseCase.ProductOrdersPaid()
      
      this.invoke(response, 200, res, "", next);
    } catch (error) {
      next(new ErrorHandler("Hubo un error al consultar la información", 500));
    }
  }
  public async paidAndSupplyPOToPoint(req: Request, res: Response, next: NextFunction) {
   
    try {
      const response = await this.productOrderUseCase.POPaidAndSupplyToPoint()
      const filteredResponse = response?.filter((item: any) => item.branch && item.branch);
      this.invoke(filteredResponse, 200, res, "", next);
    } catch (error) {
      next(new ErrorHandler("Hubo un error al consultar la información", 500));
    }
  }

  public async paidAndSupplyPO(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.productOrderUseCase.POPaidAndSupplyToPoint()
      const filteredResponse = response?.filter((item: any) => item.branch && item.deliveryLocation);
      this.invoke(filteredResponse, 200, res, "", next);
    } catch (error) {
      next(new ErrorHandler("Hubo un error al consultar la información", 500));
    }
  }


  public async AssignRoute(req: Request, res: Response, next: NextFunction) {
   const {order_id, user_id } = req.body 
    try {
      const response = await this.productOrderUseCase.updateProductOrder(order_id,{route_detail:{user:user_id, route_status:'assigned'}})
      this.invoke(response, 200, res, "Orden Asignada Correctamente", next);
    } catch (error) {
      next(new ErrorHandler("Hubo un error", 500));
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
    const user = req.user;
    
    try {
      const response: any  | null = await this.productOrderUseCase.ProductOrdersByUser(user?.id)    
      this.invoke(response, 200, res, "", next);
    } catch (error) {
          
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
    const {_id, uuid, email, fullname} = req.user._doc;
    const { storeHouse } = req.body;
    const date = new Date()
    try {
      const response = await this.productOrderUseCase.startFillProductOrder(id,{storeHouseStatus :storeHouse, supply_detail:{user:{_id, uuid, email, fullname}, date:date}})
      
      this.invoke(response, 201, res, 'Orden surtida con éxito', next);
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



