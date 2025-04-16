import { Request, Response, NextFunction, response } from "express";
import { ErrorHandler } from "../../../../shared/domain/ErrorHandler";
import { ResponseData } from "../../../../shared/infrastructure/validation/ResponseData";
import { MembershipBenefitsUseCase } from "../../../application/membership/membershipBenefitsUseCase";
import { MembershipHistoryUseCase } from "../../../application/membership/membershipHistoryUseCase";
import { QrValidatedResponse } from "../../../domain/membership/MembershipEntity";
import moment from "moment";
import { serve } from "swagger-ui-express";
const { ObjectId } = require('mongodb');

export class MembershipBenefitsController extends ResponseData {
  protected path = "/membership-benefits";

  constructor(
    private membershipBenefitsUseCase: MembershipBenefitsUseCase,
    private memberHistoryUseCase: MembershipHistoryUseCase,

  ) {
    super();
    this.getAllMembershipsBenefits = this.getAllMembershipsBenefits.bind(this);
    this.createMembershipBenefit = this.createMembershipBenefit.bind(this);
    // this.updateMembershipBenefit = this.updateMembershipBenefit.bind(this);
    this.deleteMembershipBenefit = this.deleteMembershipBenefit.bind(this);
    this.getMembershipHistory = this.getMembershipHistory.bind(this);
    this.getUpOneBenefit = this.getUpOneBenefit.bind(this);
    this.getHistory = this.getHistory.bind(this);
    this.consumeBenefit = this.consumeBenefit.bind(this);
    this.getAllMembershipsBenefitsByUser = this.getAllMembershipsBenefitsByUser.bind(this);
    this.QrVerify = this.QrVerify.bind(this);
    this.MembershipSales = this.MembershipSales.bind(this);
  }

  public async getMembershipHistory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {

    const { id } = req.params;
    try {
      const response = await this.membershipBenefitsUseCase.getDetailMembershipBenefitHistory(id);
      this.invoke(response, 200, res, "ok", next);
    } catch (error) {

    }
  }

  public async getAllMembershipsBenefits(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await this.membershipBenefitsUseCase.getMembershipBenefits();
      this.invoke(response, 200, res, "", next);
    } catch (error) {
      next(new ErrorHandler("Hubo un error al consultar la información", 500));
    }
  }

  public async getAllMembershipsBenefitsByUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.params
    const _id = new ObjectId(id)
    try {
      const response = await this.membershipBenefitsUseCase.getMembershipBenefitsUser(_id);
      this.invoke(response, 200, res, "", next);
    } catch (error) {


      next(new ErrorHandler("Hubo un error al consultar la información", 500));
    }
  }

  public async createMembershipBenefit(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const {
      membership_id,
      service_id,
      client_id,
      quantity,
      start_date,
      end_date,
    } = req.body;
    const membership = new ObjectId(membership_id);
    const service = new ObjectId(service_id);
    const user = new ObjectId(client_id);

    try {
      // Crear beneficio de membresía
      const memBenefit: any = await this.membershipBenefitsUseCase.createNewMembershipBenefit(
        { membership_id: membership },
        { service_id: service },
        { client_id: user },
        quantity,
        start_date,
        end_date,
      );
      const membershipBenfit_id = memBenefit?._id;
      // Crear historial de membresía
      const historyPromises = Array.from({ length: quantity }, async () => {
        return this.memberHistoryUseCase.createOneHistoryMembership(

          membershipBenfit_id
        );
      });
      await Promise.all(historyPromises);
      const idMembership = membershipBenfit_id.toString()
      const response = await this.membershipBenefitsUseCase.getDetailMembershipBenefitHistory(idMembership)
      this.invoke(response, 201, res, "Creado con éxito", next);
    } catch (error) {

      next(new ErrorHandler("Hubo un error al crear", 500))
    }

  }

  public async deleteMembershipBenefit(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.params;
    try {
      const response = await this.membershipBenefitsUseCase.deleteMembershipBenefit(
        id
      );
      this.invoke(response, 201, res, "Eliminado con exito", next);
    } catch (error) {
      next(new ErrorHandler("Hubo un error eliminar", 500));
    }
  }

  public async getUpOneBenefit(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.params
    const date_service = new Date();
    try {
      const resp = await this.memberHistoryUseCase.deleteHistoryMembership(id, date_service)
      this.invoke(resp, 200, res, 'Servicio pagado con éxito', next)
    } catch (error) {

      next(new ErrorHandler("Hubo un error eliminar", 500));


    }
  }

  public async getHistory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {

    try {
      const resp = await this.memberHistoryUseCase.getHistoryMembership()
      this.invoke(resp, 200, res, 'Servicio pagado con éxito', next)
    } catch (error) {

      next(new ErrorHandler("Hubo un error ", 500));


    }
  }

  public async consumeBenefit(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.params

    const { membershipBenefit_id, typeCar_id, car_color, plate_number, branch_office_id } = req.body
    try {
      const validateActivated = await this.membershipBenefitsUseCase.verifiedActiveBenefits(membershipBenefit_id, typeCar_id)

      if (!(validateActivated instanceof ErrorHandler)) {
        const date_service = moment().format()
        const response = await this.memberHistoryUseCase.consumeBenefit(id, membershipBenefit_id, date_service, typeCar_id, car_color, plate_number, branch_office_id, { service: validateActivated.service_id })
        this.invoke(response, 200, res, 'Servicio pagado con éxito', next)
      }
      else {
        next(validateActivated)
      }
    } catch (error) {

      next(new ErrorHandler("Servicio ya consumido", 500));


    }
  }

  public async QrVerify(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.params
    const { membershipBenefit_id } = req.body
    const idH = id
    const trimmedId = idH.trim();


    try {
      const response = await this.membershipBenefitsUseCase.getDetailMembershipBenefit(membershipBenefit_id)

      const memhistory = await this.memberHistoryUseCase.getOneMemHistory(trimmedId)

      if (memhistory.status?.type === false) {
        next(new ErrorHandler('El beneficio se encuentra canjeado', 500))
      } else {

        this.invoke(response, 200, res, '', next)
      }

    } catch (error) {


      next(new ErrorHandler("Hubo un error ", 500));
    }

  }

  public async MembershipSales(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { date_service, branch_office_id } = req.body

    try {
      const response = await this.memberHistoryUseCase.getSalesDay(date_service, branch_office_id)
      this.invoke(response, 200, res, '', next)

    } catch (error) {
      next(new ErrorHandler("Hubo un error al consultar la información", 500));
    }
  }
}

