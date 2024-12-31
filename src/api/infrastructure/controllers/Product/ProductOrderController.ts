import { S3Service } from './../../../../shared/infrastructure/aws/S3Service';
import { Request, Response, NextFunction } from 'express';
import { ErrorHandler } from "../../../../shared/domain/ErrorHandler";
import { ResponseData } from "../../../../shared/infrastructure/validation/ResponseData";
import { ProductOrderUseCase } from '../../../application/product/productOrderUseCase';
import { RandomCodeShipping } from '../../../../shared/infrastructure/validation/Utils';
import { buildPDF } from '../../../../libs/pdfKit';
import { RegionUseCase } from '../../../application/regions/regionUseCase';
import { RegionsService } from '../../../../shared/infrastructure/Regions/RegionsService';
import { StockStoreHouseUseCase } from '../../../application/storehouse/stockStoreHouseUseCase';
import { log } from 'console';
export class ProductOrderController extends ResponseData {
  protected path = "/productOrder";
  private readonly onlineStoreHouse = "662fe69b9ba1d8b3cfcd3634";

  constructor(
    private productOrderUseCase: ProductOrderUseCase,
    private readonly regionUseCase : RegionUseCase,
    private readonly s3Service: S3Service,
    private readonly regionsService: RegionsService,
    private stockStoreHouseUseCase: StockStoreHouseUseCase,
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
    this.verifyQrToPoint = this.verifyQrToPoint.bind(this);
    this.endShippingOrder = this.endShippingOrder.bind(this);
    this.endShippingOrdertoPoint = this.endShippingOrdertoPoint.bind(this);
    this.pdfOrder = this.pdfOrder.bind(this)
    this.pendingTransferPO = this.pendingTransferPO.bind(this)
    this.autoAssignProductOrders = this.autoAssignProductOrders.bind(this)
    this.VerifyPackage = this.VerifyPackage.bind(this);
    this.ReadyProductOrdersToPoint = this.ReadyProductOrdersToPoint.bind(this);
    this.OptimizedPackagesToPoint = this.OptimizedPackagesToPoint.bind(this);
    this.OutOfRegionsPO = this.OutOfRegionsPO.bind(this);
    this.paidAndFillProductOrders = this.paidAndFillProductOrders.bind(this);
  this.getAssignedPOUser = this.getAssignedPOUser.bind(this)
  }

  public async getAllProductOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.productOrderUseCase.getProductOrders()

      this.invoke(response, 200, res, "", next);
    } catch (error) {
      next(new ErrorHandler("Hubo un error al consultar la información", 500));
    }
  }
  
  public async pdfOrder(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const response: any = await this.productOrderUseCase.getOneProductOrder(id);

      res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=order${response.order_id}.pdf`
      });

      const stream = res;

      buildPDF(
        response,
        (data: any) => stream.write(data),
        () => stream.end()
      );

    } catch (error) {
      console.log(error);

      next(new ErrorHandler("Hubo un error al generar el PDF", 500));
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
  public async paidAndFillProductOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.productOrderUseCase.ProductOrdersPaidAndFill()
      this.invoke(response, 200, res, "", next);
    } catch (error) {
      next(new ErrorHandler("Hubo un error al consultar la información", 500));
    }
  }

  public async pendingTransferPO(req: Request, res: Response, next: NextFunction) {

    try {
      const response = await this.productOrderUseCase.PendingTransferPO()
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
        const user = req.user
    try {
      const response = await this.productOrderUseCase.POGetAssigned()

      this.invoke(response, 200, res, "", next);
    } catch (error) {
      next(new ErrorHandler("Hubo un error al consultar la información", 500));
    }
  }

  public async getAssignedPOUser(req: Request, res: Response, next: NextFunction) {
    const user = req.user
try {
  const response = await this.productOrderUseCase.POGetAssignedUser(user.id)

  this.invoke(response, 200, res, "", next);
} catch (error) {
  next(new ErrorHandler("Hubo un error al consultar la información", 500));
}
}


  public async AssignRoute(req: Request, res: Response, next: NextFunction) {
    const { order_id, user_id, guide, shipping_company, guide_pdf } = req.body;
    let updated_guide_pdf = guide_pdf  
    try {
  
      let response;
      if (user_id) {
        response = await this.productOrderUseCase.updateProductOrder(order_id, {
          route_detail: { user: user_id, route_status: 'assigned', guide: '', shipping_company: '' },
        });
        this.invoke(response, 200, res, "Orden Asignada Correctamente", next);
      } else {
        if (req.file) {
          const path = `/${this.path}/${user_id}/${order_id}/${guide}`
           const {url} = await this.s3Service.uploadToS3AndGetUrl(path , req.file, "application/pdf");
           updated_guide_pdf =  url.split("?")[0] 
         }  
        
        response = await this.productOrderUseCase.updateProductOrder(order_id, {
          route_detail: {
            guide: guide,
            route_status: 'assigned',
            shipping_company: shipping_company,
            user_id: '',
            guide_pdf: updated_guide_pdf
          },
        });
        this.invoke(response, 200, res, "Guía y Compañía de Envío Asignadas Correctamente", next);
      }
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
      // Obteniendo la orden de producto
      const response: any = await this.productOrderUseCase.getOneProductOrder(id);
  
      // Verificando si existen vouchers de pago y obteniendo las URLs desde S3
      if (response.payment && response.payment.verification && response.payment.verification.payment_vouchers) {
        const promises = response.payment.verification.payment_vouchers.map(async (item: any) => {
          const url = await this.s3Service.getUrlObject(item.url);
          item.url = url; // Actualizando el URL con el valor desde S3
        });
        await Promise.all(promises); // Espera a que todas las promesas se resuelvan
      }
  
      // Invocando la respuesta final
      this.invoke(response, 200, res, "", next);
  
    } catch (error) {
      next(new ErrorHandler(`Error al consultar la información`, 500)); // Manejo de error
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
  public async VerifyPackage(req: Request, res: Response, next: NextFunction) {
    const user = req.user
    const {id} = req.params
    const code = RandomCodeShipping()
    try {
      const response: any | null = await this.productOrderUseCase.updateProductOrder(id, {route_detail: { route_status: 'assigned', user: user._id }, verification: { verification_code: code, verification_status: false } })

      this.invoke(response, 200, res, "Paquete tomado exitosamente", next);
    } catch (error) {
      next(new ErrorHandler("Hubo un error al tomar el paquete", 500));
    }
  }

  public async verifyQr(req: Request, res: Response, next: NextFunction) {
    const { order_id, user_id, v_code, branch_id } = req.body


    const date = new Date()

    try {
      const { verification, _id }: any | null = await this.productOrderUseCase.getOnePO({ order_id: order_id, user_id: user_id })


      if (verification.verification_code !== v_code) {
        return next(new ErrorHandler("El código no coincide", 500));
      }
      if (branch_id) {
        const update = await this.productOrderUseCase.updateProductOrder(_id, { point_pickup_status: true, 'route_detail.route_status': 'point_puckup' })
        this.invoke(update, 200, res, "Paquete entregado punto de recolección", next);
      }
      else {
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
      const { verification, _id }: any | null = await this.productOrderUseCase.getOnePO({ order_id: order_id, user_id: user_id })


      if (verification.verification_code !== v_code) {
        return next(new ErrorHandler("El código no coincide", 500));
      }
      if (branch_id) {
        const update = await this.productOrderUseCase.updateProductOrder(_id, { point_pickup_status: true, 'route_detail.route_status': 'point_puckup' })
        this.invoke(update, 200, res, "Paquete entregado punto de recolección", next);
      }
    } catch (error) {
      next(new ErrorHandler("Error en el codigo", 500));
    }
  }

  public async getOneProductOrderByUser(req: Request, res: Response, next: NextFunction) {
    const user: any = req.user;
    try {
      const response: any | null = await this.productOrderUseCase.ProductOrdersByUser(user?.id)
      // console.log("response xdd", response);      
      // Promise.all(response.map(async (item: any) => {        
      //  const newParsedProducts = await Promise.all(item.products.map(async (product: any) => {
      //    const url = await this.s3Service.getUrlObject(product.item.thumbnail);
      //    product.item.thumbnail = url; // Actualizando el URL con el valor desde S3
      //    return product;
      //  })) 
      //  item.products = newParsedProducts 
      //  return item
      // }))      
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
      const response = await this.productOrderUseCase.updateProductOrder(_id, { deliveryStatus: true, 'verification.notes': notes })
      this.invoke(response, 201, res, 'Se entregó con éxito', next);
    } catch (error) {
      next(new ErrorHandler('Hubo un error al entregar', 500));
    }

  }

  public async endShippingOrdertoPoint(req: Request, res: Response, next: NextFunction) {
    const { _id, notes } = req.body;
    try {
      const response = await this.productOrderUseCase.updateProductOrder(_id, { deliveryStatus: true, 'verification.notes': notes })
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
    const { _id, uuid, email, fullname } = req.user;
    const { storeHouse } = req.body;
    const date = new Date()
    try {
      const response = await this.productOrderUseCase.startFillProductOrder(id, { storeHouseStatus: storeHouse, supply_detail: { user: { _id, uuid, email, fullname }, date: date } })

      this.invoke(response, 201, res, 'Orden surtida con éxito', next);
    } catch (error) {

      next(new ErrorHandler("Hubo un error ", 500));
    }
  }

  public async autoAssignProductOrders(req: Request, res: Response, next: NextFunction) {
    const user = req.user
    const operationRegions = user.employee_detail?.operationRegions || [] // Corregido el nombre de la variable
  
    try {
      const OPRegions: any[] = [];
  
      // Uso de for...of en lugar de map con await
      for (const item of operationRegions) {
        const i = item.toString()
        
        const region = await this.regionUseCase.getOneRegion(i);
        
        if (region instanceof ErrorHandler) {
          return next(new ErrorHandler('No existe la región', 500)); // Manejo correcto de error
        }
  
        OPRegions.push(region); // Si la región es válida, se agrega al arreglo
      }
  
      // Obtener puntos de las órdenes pagadas y con suministro
      const points: any = await this.productOrderUseCase.POPaidAndSupplyToPoint();

      // Agrupar las órdenes por región
      const response = this.regionsService.groupOrdersByRegion(points, OPRegions);
  
      // Enviar respuesta
      this.invoke(response, 201, res, 'Consulta exitosa', next);
      
    } catch (error) {
      console.log(error);
      next(new ErrorHandler("Hubo un error", 500)); // Manejo de errores
    }
  }

  public async ReadyProductOrdersToPoint(req: Request, res: Response, next: NextFunction) {
    const user = req.user
    const operationRegions = user.employee_detail?.operationRegions || [] // Corregido el nombre de la variable
  
    try {
      const OPRegions: any[] = [];
  
      // Uso de for...of en lugar de map con await
      for (const item of operationRegions) {
        const i = item.toString()
        
        const region = await this.regionUseCase.getOneRegion(i);
        
        if (region instanceof ErrorHandler) {
          return next(new ErrorHandler('No existe la región', 500)); // Manejo correcto de error
        }
  
        OPRegions.push(region); // Si la región es válida, se agrega al arreglo
      }
  
      // Obtener puntos de las órdenes pagadas y con suministro
      const points: any = await this.productOrderUseCase.POReadyToRoute();

      // Agrupar las órdenes por región
      const response = this.regionsService.groupOrdersByRegion(points, OPRegions);
  
      // Enviar respuesta
      this.invoke(response, 201, res, 'Consulta exitosa', next);
      
    } catch (error) {
      console.log(error);
      next(new ErrorHandler("Hubo un error", 500)); // Manejo de errores
    }
  }

  public async OutOfRegionsPO(req: Request, res: Response, next: NextFunction) {
    
    const OPRegions = await this.regionUseCase.getAllRegions()
    try {
      
  
      // Obtener puntos de las órdenes pagadas y con suministro
      const points: any = await this.productOrderUseCase.POPaidAndSupplyToPoint();

      // Agrupar las órdenes por región
      const response = this.regionsService.groupOutOfRegion(points, OPRegions);
  
      // Enviar respuesta
      this.invoke(response, 201, res, 'Consulta exitosa', next);
      
    } catch (error) {
      console.log(error);
      next(new ErrorHandler("Hubo un error", 500)); // Manejo de errores
    }
  }

  public async OptimizedPackagesToPoint(req: Request, res: Response, next: NextFunction) {
    const user = req.user;
    const {coords} = req.query
    const operationRegions = user.employee_detail?.operationRegions || [];
    


const convertToNumericLocation = (coords: any) => {
  // Verificar que lat y lgt sean strings, y no arrays
  const lat = Array.isArray(coords.lat) ? coords.lat[0] : coords.lat;
  const lgt = Array.isArray(coords.lgt) ? coords.lgt[0] : coords.lgt;

  // Convertir las cadenas a números si son válidas
  const numericLocation = {
    lat: lat ? Number(lat) : NaN,
    lgt: lgt ? Number(lgt) : NaN
  };

  // Verificar que la conversión sea válida
  if (!isNaN(numericLocation.lat) && !isNaN(numericLocation.lgt)) {
    return numericLocation;
  } else {
    throw new Error("Invalid latitude or longitude values.");
  }
};
const numericLocation = convertToNumericLocation(coords);
  
    try {
      const OPRegions: any[] = [];
  
      // Uso de for...of con manejo de errores por región
      for (const item of operationRegions) {
        const regionId = item.toString();
  
        try {
          const region = await this.regionUseCase.getOneRegion(regionId);
          
          if (!region) {
            console.warn(`No existe la región con ID: ${regionId}`);
            continue; // Si no existe la región, pasamos a la siguiente
          }
  
          OPRegions.push(region); // Agregar la región válida
        } catch (err) {
          console.warn(`Error al obtener la región con ID: ${regionId}`, err);
          // Manejar el error, pero continuar con el resto de las regiones
        }
      }
  
      // Obtener puntos de las órdenes pagadas y con suministro
      const points: any = await this.productOrderUseCase.POReadyToRoute();
      
      // Agrupar las órdenes por región
      const response = this.regionsService.groupOrdersByRegion(points, OPRegions);
      const extractCoordinates = (orders: any) => {
        return orders.map((order : any) => {
          // Priorizar `deliveryLocation` si existe, sino usar `branch.location`
          const location = order.deliveryLocation || order.branch?.location;
      
          if (location && location.lat && location.lgt) {
            return {
              lat: location.lat,
              lgt: location.lgt,
              order: order.order_id
            };
          } else {
            console.warn("No valid location found for order:", order);
            return null; // Devuelve null si no hay coordenadas válidas
          }
        }).filter(Boolean); // Filtrar los valores null o undefined
      };
      const points1 = extractCoordinates(response)

      const pointsWithUserLocation = [
        numericLocation,  // Ubicación actual como inicio
        ...points1,  // Puntos intermedios
        numericLocation,
      ];
       const distanceMatrix = await this.regionsService.getDistanceMatrix(pointsWithUserLocation);
       
        const bestRoute = this.regionsService.simulatedAnnealingTSP(distanceMatrix);
  
       const directions = await this.regionsService.getOptimizedRoute(pointsWithUserLocation, bestRoute);
       
  
      // Enviar respuesta
      this.invoke({...directions}, 201, res, 'Consulta exitosa', next);
  
    } catch (error) {
      console.log(error);
      
      next(new ErrorHandler("Hubo un error", 500)); // Manejo general de errores
    }
  }
  



  public async deleteProductOrder(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const user = req.user.id
    try {
      if(!id) return next(new ErrorHandler('El id de la orden es requerido', 404));
      const userOrder: any = await this.productOrderUseCase.getOnePO({ order_id: id, status: true, user_id: user })
      const products = userOrder.products
      await Promise.all(products.map(async (product: any) => {
        const stockProduct = await this.stockStoreHouseUseCase.getProductStock(product.item._id, this.onlineStoreHouse)
        const currentProductStock = stockProduct.stock;        
        const stockToReturn = product.quantity; 
        const newProductStock = currentProductStock + stockToReturn;
        const updateStock = await this.stockStoreHouseUseCase.updateStock(stockProduct._id, { stock: newProductStock })                         
      }))
        
      if (!userOrder) {
        return next(new ErrorHandler('No se encontro el pedido', 500));
      }
      const response = await this.productOrderUseCase.updateProductOrder(userOrder._id, { status: false })
      // const stock = await this.stockStoreHouseUseCase.getProductStock()
      this.invoke(response, 201, res, 'Se eliminó con éxito', next);
    } catch (error) {
      next(new ErrorHandler("Hubo un error al consultar la información ", 500));
    }
  }



}



