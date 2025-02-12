import Facturapi from 'facturapi';
import { config } from '../../../../config';
import { ErrorHandler } from '../../domain/ErrorHandler';
export class FacturapiService {

  private facturapi_key = config.FACTURAPI_KEY;
  private facturapi : Facturapi;

  constructor(){
    this.facturapi = new Facturapi(this.facturapi_key);
  }

  async createInvoice(customer: string | Object, items: Array<Object>, payment_form: string, use: string) {
    try{
      const payload = {
        customer: customer,
        items: items,
        payment_form: payment_form,
        use: use,
        payment_method: "PUE"
      }
      const invoice = this.facturapi.invoices.create(payload);
      return invoice;
    }catch(error){
        throw new ErrorHandler("Facturapi: Error al crear factura", 400);
    }
  }
  async listInvoices(query = {}) {
    try {
      const invoices = await this.facturapi.invoices.list(query);
      return invoices;
    } catch(error) {
      throw new ErrorHandler("Facturapi: Error al listar facturas", 400);
    }
  }

  async retrieveInvoice(id: string) {
    try {
      const invoice = await this.facturapi.invoices.retrieve(id);
      return invoice;
    } catch(error) {
      throw new ErrorHandler("Facturapi: Error al obtener factura", 400);
    }
  }

  async cancelInvoice(id: string, motive: string) {
    try {
      const invoice = await this.facturapi.invoices.cancel(id, motive);
      return invoice;
    } catch(error) {
      throw new ErrorHandler("Facturapi: Error al cancelar factura", 400);
    }
  }

  async downloadInvoice(id: string, format: string = 'pdf') {
    try {
      const invoice = await this.facturapi.invoices.downloadZip(id, format);
      return invoice;
    } catch(error) {
      throw new ErrorHandler("Facturapi: Error al descargar factura", 400);
    }
  }

  async sendInvoiceByEmail(id: string, email: string) {
    try {
      const invoice = await this.facturapi.invoices.sendByEmail(id, { email : email});
      return invoice;
    } catch(error) {
      throw new ErrorHandler("Facturapi: Error al enviar factura por email", 400);
    }
  }

  async createCustomer(payload: Object){
    console.log(payload, "facturapi data");    
    try{
        const customer = this.facturapi.customers.create(payload);        
        return customer;
    }catch(error){                
        throw new ErrorHandler("Facturapi: Error al crear usuario", 400);
    }
  }

  async editCustomer(id: string , payload = Object){
    try{
        const customer = this.facturapi.customers.update(id, payload);
        return customer;
    }catch(error){
        throw new ErrorHandler("Facturapi: Error al editar usuario", 400);
    }
  }

  async deleteCustomer(id: string) {
    try {
      const customer = this.facturapi.customers.del(id);
      return customer;
    } catch(error) {
      throw new ErrorHandler("Facturapi: Error al eliminar usuario", 400);
    }
  }

  async retrieveCustomer(id = ""){
    try{
      const customer = this.facturapi.customers.retrieve(id);
      return customer;
    }catch(error){
        throw new ErrorHandler("Facturapi: Error al obtener usuario", 400);
    }
  }

  async listCustomers(query = {}) {
    try {
      const customers = this.facturapi.customers.list(query);
      return customers;
    } catch(error) {
      throw new ErrorHandler("Facturapi: Error al listar usuarios", 400);
    }
  }

  async registerProduct(payload = {}){
    try{
        const product = this.facturapi.products.create(payload);
        return product;
    }catch(error){
        throw new ErrorHandler("Facturapi: Error al registrar producto", 400);
    }
  }


}