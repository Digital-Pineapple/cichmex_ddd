"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerController = void 0;
const ErrorHandler_1 = require("../../../../shared/domain/ErrorHandler");
const ResponseData_1 = require("../../../../shared/infrastructure/validation/ResponseData");
class CustomerController extends ResponseData_1.ResponseData {
    constructor(customerUseCase, s3Service) {
        super();
        this.customerUseCase = customerUseCase;
        this.s3Service = s3Service;
        this.path = '/customer';
        this.getAllCustomers = this.getAllCustomers.bind(this);
        this.createCustomer = this.createCustomer.bind(this);
        this.getCustomerDetail = this.getCustomerDetail.bind(this);
        this.updateCustomer = this.updateCustomer.bind(this);
        this.deleteCustomer = this.deleteCustomer.bind(this);
        this.getAllCustomersByType = this.getAllCustomersByType.bind(this);
        this.validateCustomer = this.validateCustomer.bind(this);
    }
    getAllCustomers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customers = yield this.customerUseCase.getCustomers();
                yield Promise.all(customers === null || customers === void 0 ? void 0 : customers.map((customer) => __awaiter(this, void 0, void 0, function* () {
                    if (customer.google !== true) {
                        const url = yield this.s3Service.getUrlObject(customer.profile_image + ".jpg");
                        customer.profile_image = url;
                    }
                })));
                this.invoke(customers, 200, res, '', next);
            }
            catch (error) {
                console.log(error, 'si es');
                next(new ErrorHandler_1.ErrorHandler('Hubo un error al consultar los usuarios', 500));
            }
        });
    }
    getCustomerDetail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const customer = yield this.customerUseCase.getDetailCustomer(id);
                const image = yield this.s3Service.getUrlObject((customer === null || customer === void 0 ? void 0 : customer.profile_image) + ".jpg");
                customer.profile_image = image;
                this.invoke(customer, 200, res, '', next);
            }
            catch (error) {
                next(new ErrorHandler_1.ErrorHandler('Error al encontrar el usuario', 404));
            }
        });
    }
    createCustomer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fullname, email, password } = req.body;
            try {
                const customer = yield this.customerUseCase.createNewCustomer(fullname, email, password);
                this.invoke(customer, 201, res, 'El usuario se creo con exito', next);
            }
            catch (error) {
                next(new ErrorHandler_1.ErrorHandler('Hubo un error al crear el usuario', 500));
            }
        });
    }
    updateCustomer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { fullname, type_customer } = req.body;
            try {
                if (req.file) {
                    const pathObject = `${this.path}/${id}/${fullname}`;
                    const { url, success } = yield this.s3Service.uploadToS3AndGetUrl(pathObject + ".jpg", req.file, "image/jpeg");
                    if (!success)
                        return new ErrorHandler_1.ErrorHandler('Hubo un error al subir la imagen', 400);
                    const response = yield this.customerUseCase.updateOneCustomer(id, { fullname, type_customer, profile_image: pathObject });
                    console.log(response);
                    response.profile_image = url;
                    this.invoke(response, 201, res, 'El usuario se actualizó con éxito jsjs', next);
                }
                else {
                    const response = yield this.customerUseCase.updateOneCustomer(id, { fullname, type_customer });
                    this.invoke(response, 201, res, 'El usuario se actualizó con éxitojaja', next);
                }
            }
            catch (error) {
                console.log(error);
                next(new ErrorHandler_1.ErrorHandler('Hubo un error al editar la información', 500));
            }
        });
    }
    deleteCustomer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const customer = yield this.customerUseCase.updateOneCustomer(id, { status: false });
                this.invoke(customer, 200, res, 'El usuario ha sido eliminado', next);
            }
            catch (error) {
                console.log(error);
                next(new ErrorHandler_1.ErrorHandler('Hubo un error al eliminar el usuario', 500));
            }
        });
    }
    convertUserToPartner(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = req;
            try {
                const customer = yield this.customerUseCase.becomeAPartner(user._id);
                this.invoke(customer, 200, res, 'Felicidades ahora formas parte de nuestra familia', next);
            }
            catch (error) {
                console.log(error);
                next(new ErrorHandler_1.ErrorHandler('Hubo un error al eliminar el usuario', 500));
            }
        });
    }
    getAllCustomersByType(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { type } = req.params;
            try {
                const customers = yield this.customerUseCase.getCustomersByType(type);
                this.invoke(customers, 200, res, '', next);
            }
            catch (error) {
                console.log(error);
                next(new ErrorHandler_1.ErrorHandler('Hubo un error al consultar los usuarios', 500));
            }
        });
    }
    validateCustomer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const customer = yield this.customerUseCase.validateOneCustomer(id);
                this.invoke(customer, 200, res, 'El usuario se valido con exito', next);
            }
            catch (error) {
                console.log(error);
                next(new ErrorHandler_1.ErrorHandler('Hubo un error al validar el usuario', 500));
            }
        });
    }
}
exports.CustomerController = CustomerController;
