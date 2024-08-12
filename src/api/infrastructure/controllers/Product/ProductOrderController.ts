import { S3Service } from './../../../../shared/infrastructure/aws/S3Service';
import { Request, Response, NextFunction, response } from 'express';
import { ErrorHandler } from "../../../../shared/domain/ErrorHandler";
import { ResponseData } from "../../../../shared/infrastructure/validation/ResponseData";
import { ProductOrderUseCase } from '../../../application/product/productOrderUseCase';
import { RandomCodeShipping } from '../../../../shared/infrastructure/validation/Utils';

export class ProductOrderController extends ResponseData {
  protected path = "/productOrder";

  constructor(
    private productOrderUseCase: ProductOrderUseCase,
    private readonly s3Service: S3Service
  ) {
    super();
    this.getAllProductOrders = this.getAllProductOrders.bind(this);
    this.paidProductOrders = this.paidProductOrders.bind(this);
    this.gerProductOrderResume = this.gerProductOrderResume.bind(this);
    this.getOneProductOrder = this.getOneProductOrder.bind(this);
    this.getOneProductOrderByUser = this.getOneProductOrderByUser.bind(this);
    this.createProductOrder = this.createProductOrder.bind(this);
    this.updateProductOrder = this.updateProductOrder.bind(this);
    this.deleteProductOrder = this.deleteProductOrder.bind(this);
    this.fillProductOrder = this.fillProductOrder.bind(this);
    this.paidAndSupplyPOToPoint = this.paidAndSupplyPOToPoint.bind(this);
    this.paidAndSupplyPO = this.paidAndSupplyPO.bind(this);
    this.AssignRoute = this.AssignRoute.bind(this);
    this.getAssignedPO = this.getAssignedPO.bind(this);
    this.verifyAndStartRoute = this.verifyAndStartRoute.bind(this);
    this.getDeliveries = this.getDeliveries.bind(this);
    this.getProductOrderByBranch = this.getProductOrderByBranch.bind(this);
    this.verifyQr = this.verifyQr.bind(this);
    this.verifyQrToPoint  = this.verifyQrToPoint.bind(this);
    this.endShippingOrder = this.endShippingOrder.bind(this);
    this.endShippingOrdertoPoint = this.endShippingOrdertoPoint.bind(this);
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
      const response: any = await this.productOrderUseCase.POPaidAndSupplyToPoint()
      const filteredResponse = response?.filter((item: any) => item.branch && item.branch);
      this.invoke(filteredResponse, 200, res, "", next);
    } catch (error) {
      next(new ErrorHandler("Hubo un error al consultar la información", 500));
    }
  }

  public async paidAndSupplyPO(req: Request, res: Response, next: NextFunction) {
    try {
      const response: any = await this.productOrderUseCase.POPaidAndSupplyToPoint()
      const filteredResponse = response?.filter((item: any) => item.deliveryLocation && item.deliveryLocation);
      this.invoke(filteredResponse, 200, res, "", next);
    } catch (error) {
      next(new ErrorHandler("Hubo un error al consultar la información", 500));
    }
  }

  public async getAssignedPO(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.productOrderUseCase.POGetAssigned()

      this.invoke(response, 200, res, "", next);
    } catch (error) {
      next(new ErrorHandler("Hubo un error al consultar la información", 500));
    }
  }


  public async AssignRoute(req: Request, res: Response, next: NextFunction) {
    const { order_id, user_id } = req.body
    try {
      const response = await this.productOrderUseCase.updateProductOrder(order_id, { route_detail: { user: user_id, route_status: 'assigned' } })
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
      console.log(error);
      
      next(new ErrorHandler("Hubo un error al consultar la información", 500));
    }
  }

  public async getDeliveries(req: Request, res: Response, next: NextFunction) {
    try {
      const response: any | null = await this.productOrderUseCase.PODeliveries()
      this.invoke(response, 200, res, "", next);
    } catch (error) {
      console.log(error);

      next(new ErrorHandler("Hubo un error al consultar la información", 500));
    }
  }

  public async verifyAndStartRoute(req: Request, res: Response, next: NextFunction) {
    const { id, user_id } = req.body
    const code = RandomCodeShipping()

    try {
      const response: any | null = await this.productOrderUseCase.updateProductOrder(id, { route_status: true, route_detail: { route_status: 'in transit', user: user_id }, verification: { verification_code: code, verification_status: false } })

      this.invoke(response, 200, res, "Comenzo el envio exitosamente", next);
    } catch (error) {
      next(new ErrorHandler("Hubo un error al consultar la información", 500));
    }
  }

  public async verifyQr(req: Request, res: Response, next: NextFunction) {
    const { order_id, user_id, v_code, branch_id } = req.body
    

    const date = new Date()

    try {
      const {verification, _id}: any | null = await this.productOrderUseCase.getOnePO({ order_id: order_id, user_id: user_id})

     
      if (verification.verification_code !== v_code) {
       return   next(new ErrorHandler("El código no coincide", 500));
     }
     if (branch_id) {
      const update = await this.productOrderUseCase.updateProductOrder(_id,{ point_pickup_status:true,'route_detail.route_status':'point_puckup'  } )
      this.invoke(update, 200, res, "Paquete entregado punto de recolección", next);
     }
     else{
       const update = await this.productOrderUseCase.updateProductOrder(_id, { verification: { verification_status: true, verification_time: date, verification_code: v_code } })
       this.invoke(update, 200, res, "Código válido", next);
     }
    } catch (error) {

      next(new ErrorHandler("Error en el codigo", 500));
    }
  }

  public async verifyQrToPoint(req: Request, res: Response, next: NextFunction) {
    const { order_id, user_id, branch_id, v_code } = req.body

    try {
      const {verification, _id}: any | null = await this.productOrderUseCase.getOnePO({ order_id: order_id, user_id: user_id})

     
      if (verification.verification_code !== v_code) {
       return   next(new ErrorHandler("El código no coincide", 500));
     }
     if (branch_id) {
      const update = await this.productOrderUseCase.updateProductOrder(_id,{ point_pickup_status:true,'route_detail.route_status':'point_puckup'  } )
      this.invoke(update, 200, res, "Paquete entregado punto de recolección", next);
     }
    } catch (error) {
      next(new ErrorHandler("Error en el codigo", 500));
    }
  }

  public async getOneProductOrderByUser(req: Request, res: Response, next: NextFunction) {
    const user = req.user;
    try {
      const response: any | null = await this.productOrderUseCase.ProductOrdersByUser(user?.id)
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
  public async endShippingOrder(req: Request, res: Response, next: NextFunction) {
    const { _id, notes } = req.body;
    try {
      const response = await this.productOrderUseCase.updateProductOrder(_id,{deliveryStatus:true, 'verification.notes': notes})
      this.invoke(response, 201, res, 'Se entregó con éxito', next);
    } catch (error) {
      next(new ErrorHandler('Hubo un error al entregar', 500));
    }

  }

  public async endShippingOrdertoPoint(req: Request, res: Response, next: NextFunction) {
    const { _id, notes } = req.body;
    try {
      const response = await this.productOrderUseCase.updateProductOrder(_id,{deliveryStatus:true, 'verification.notes': notes})
      this.invoke(response, 201, res, 'Se entregó con éxito', next);
    } catch (error) {
      next(new ErrorHandler('Hubo un error al entregar', 500));
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
    const { _id, uuid, email, fullname } = req.user._doc;
    const { storeHouse } = req.body;
    const date = new Date()
    try {
      const response = await this.productOrderUseCase.startFillProductOrder(id, { storeHouseStatus: storeHouse, supply_detail: { user: { _id, uuid, email, fullname }, date: date } })

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



