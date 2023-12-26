import { Request, Response, NextFunction, response } from "express";
import { ErrorHandler } from "../../../../shared/domain/ErrorHandler";
import { ResponseData } from "../../../../shared/infrastructure/validation/ResponseData";
import { MembershipBenefitsUseCase } from "../../../application/membership/membershipBenefitsUseCase";
import { MembershipHistoryUseCase } from "../../../application/membership/membershipHistoryUseCase";


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
      console.log(error);
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
      status,
    } = req.body;

    try {
      // Crear beneficio de membresía
      const memBenefit = await this.membershipBenefitsUseCase.createNewMembershipBenefit(
        membership_id,
        service_id,
        client_id,
        quantity,
        start_date,
        end_date,
        status
      );
      const membershipBenfit_id = memBenefit?._id;
      // Crear historial de membresía
      const historyPromises = Array.from({ length: quantity }, async () => {
        const date_service = new Date();
        date_service.setFullYear(0, 0, 0);
        return this.memberHistoryUseCase.createOneHistoryMembership(
          date_service,
          membershipBenfit_id
        );
      });
      await Promise.all(historyPromises);
      const idMembership = membershipBenfit_id.toString()
      const response =  await this.membershipBenefitsUseCase.getDetailMembershipBenefitHistory(idMembership)
      this.invoke(response, 201, res, "Ceradoo con éxito alta con éxito", next);
    } catch (error) {
      console.log(error);
      next(new ErrorHandler("Hubo un error al crear", 500))
    }

  }

  // public async updateMembershipBenefit(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   const { id } = req.params;
  //   const {
  //     membership_id,
  //     service_id,
  //     client_id,
  //     quantity,
  //     start_date,
  //     end_date,
  //     status,
  //     // membership_history,
  //   } = req.body;
  //   try {
  //     const response = await this.membershipBenefitsUseCase.updateOneMembershipBenefit(
  //       id,
  //       {
  //         membership_id,
  //         service_id,
  //         client_id,
  //         quantity,
  //         start_date,
  //         end_date,
  //         status,
  //       }
  //     );
  //     this.invoke(response, 201, res, "Se actualizó con éxito", next);
  //   } catch (error) {
  //     console.log(error);
  //     next(new ErrorHandler("Hubo un error al actualizar", 500));
  //   }
  // }

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
  ){
    const { id } = req.params
    const date_service = new Date();
    try {
      const resp = await this.memberHistoryUseCase.deleteHistoryMembership(id,  date_service)
      this.invoke(resp,200,res,'Servicio pagado con éxito',next)
    } catch (error) {
      console.log(error);
      next(new ErrorHandler("Hubo un error eliminar", 500));
      
      
    }
  }
  
  
}
