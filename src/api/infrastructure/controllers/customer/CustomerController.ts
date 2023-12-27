import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../../../../shared/domain/ErrorHandler";
import { S3Service } from "../../../../shared/infrastructure/aws/S3Service";

import { ResponseData } from "../../../../shared/infrastructure/validation/ResponseData";

import { CustomerUseCase } from "../../../application/customer/CustomerUseCase";

export class CustomerController extends ResponseData {
  protected path = "/customer";

  constructor(
    private customerUseCase: CustomerUseCase,
    private readonly s3Service: S3Service
  ) {
    super();
    this.getAllCustomers = this.getAllCustomers.bind(this);
    this.createCustomer = this.createCustomer.bind(this);
    this.getCustomerDetail = this.getCustomerDetail.bind(this);
    this.updateCustomer = this.updateCustomer.bind(this);
    this.deleteCustomer = this.deleteCustomer.bind(this);
    this.getAllCustomersByType = this.getAllCustomersByType.bind(this);
    this.validateCustomer = this.validateCustomer.bind(this);
  }

  public async getAllCustomers(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const customers = await this.customerUseCase.getCustomers();
      await Promise.all(
        customers?.map(async (customer) => {
          if (customer.google !== true) {
            const url = await this.s3Service.getUrlObject(
              customer.profile_image + ".jpg"
            );
            customer.profile_image = url;
          }
        })
      );

      this.invoke(customers, 200, res, "", next);
    } catch (error) {
      next(new ErrorHandler("Hubo un error al consultar los usuarios", 500));
    }
  }

  public async getCustomerDetail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.params;
    try {
      const customer = await this.customerUseCase.getDetailCustomer(id);
      const image = await this.s3Service.getUrlObject(
        customer?.profile_image + ".jpg"
      );
      customer.profile_image = image;
      this.invoke(customer, 200, res, "", next);
    } catch (error) {
      next(new ErrorHandler("Error al encontrar el usuario", 404));
    }
  }

  public async createCustomer(req: Request, res: Response, next: NextFunction) {
    const { fullname, email, password } = req.body;

    try {
      const customer = await this.customerUseCase.createNewCustomer(
        fullname,
        email,
        password
      );
      this.invoke(customer, 201, res, "El usuario se creo con exito", next);
    } catch (error) {
      next(new ErrorHandler("Hubo un error al crear el usuario", 500));
    }
  }

  public async updateCustomer(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { fullname, type_customer } = req.body;
    try {
      if (req.file) {
        const pathObject = `${this.path}/${id}/${fullname}`;

        const { url, success } = await this.s3Service.uploadToS3AndGetUrl(
          pathObject + ".jpg",
          req.file,
          "image/jpeg"
        );
        if (!success)
          return new ErrorHandler("Hubo un error al subir la imagen", 400);
        const response = await this.customerUseCase.updateOneCustomer(id, {
          fullname,
          type_customer,
          profile_image: pathObject,
        });

        response.profile_image = url;
        this.invoke(
          response,
          201,
          res,
          "El usuario se actualizó con éxito jsjs",
          next
        );
      } else {
        const response = await this.customerUseCase.updateOneCustomer(id, {
          fullname,
          type_customer,
        });
        this.invoke(
          response,
          201,
          res,
          "El usuario se actualizó con éxitojaja",
          next
        );
      }
    } catch (error) {
      next(new ErrorHandler("Hubo un error al editar la información", 500));
    }
  }

  public async deleteCustomer(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const customer = await this.customerUseCase.updateOneCustomer(id, {
        status: false,
      });
      this.invoke(customer, 200, res, "El usuario ha sido eliminado", next);
    } catch (error) {
      next(new ErrorHandler("Hubo un error al eliminar el usuario", 500));
    }
  }

  public async convertUserToPartner(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { user } = req;
    try {
      const customer = await this.customerUseCase.becomeAPartner(user._id);
      this.invoke(
        customer,
        200,
        res,
        "Felicidades ahora formas parte de nuestra familia",
        next
      );
    } catch (error) {
      next(new ErrorHandler("Hubo un error al eliminar el usuario", 500));
    }
  }

  public async getAllCustomersByType(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { type } = req.params;
    try {
      const customers = await this.customerUseCase.getCustomersByType(type);
      this.invoke(customers, 200, res, "", next);
    } catch (error) {
      next(new ErrorHandler("Hubo un error al consultar los usuarios", 500));
    }
  }

  public async validateCustomer(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.params;

    try {
      const customer = await this.customerUseCase.validateOneCustomer(id);

      this.invoke(customer, 200, res, "El usuario se valido con exito", next);
    } catch (error) {
      next(new ErrorHandler("Hubo un error al validar el usuario", 500));
    }
  }
}
