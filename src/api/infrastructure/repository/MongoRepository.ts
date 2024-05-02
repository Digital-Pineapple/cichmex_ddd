import mongoose, { Model, Document, Types } from "mongoose";
import _, { paginateSubDocs } from "mongoose-paginate-v2";


export abstract class MongoRepository {
  protected MODEL: Model<Document>;

  constructor(MODEL: Model<Document>) {
    this.MODEL = MODEL;
  }

  public async findAll(populateOne?: any, populateTwo?: any): Promise<any> {
    return await this.MODEL.find({ status: false }).populate(populateOne).populate(populateTwo);
  }
  public async findAllAll(id: string, populateOne?: any, populateTwo?: any,populateThree?:any): Promise<any> {
    return await this.MODEL.findById(id, { delted: false }).populate(populateOne).populate(populateTwo).populate(populateThree);
  }
  public async findStockByBranch(branch_id: any): Promise<any> {
    return await this.MODEL.find({ branch_id: branch_id })
  }
  public async findSubCategoriesByCategory(category_id: any): Promise<any> {
    return await this.MODEL.find({ category_id: category_id, deleted: false })
  }

  public async findOneStockByBranch(branch_id: String, product_id: String, populateConfig?: any): Promise<any> {
    const result = await this.MODEL.findOne({ product_id, branch_id }).populate(populateConfig)
    return result
  }

  public async findById(_id: String, populateConfig?: any): Promise<any> {
    return await this.MODEL.findById(_id, { deleted: false });
  }

  public async findByIdPupulate(
    _id: String,
    populateConfig?: any
  ): Promise<any> {
    return await this.MODEL.findById(_id)
      .populate(populateConfig)

  }

  public async findNameById(_id: String, populateConfig?: any): Promise<any> {
    return await this.MODEL.findById(_id)
      .populate(populateConfig)
      .then((res) => res?._id);
  }
  public async findByName(name: string): Promise<any> {
    return await this.MODEL.find({ name });
  }
  public async findByPhoneNumber(phone_number: string): Promise<any> {
    return await this.MODEL.find({ phone_number: phone_number, deleted: false });
  }
  public async findByUser(_id: string): Promise<any> {
    return await this.MODEL.find({ user_id: _id, deleted: false });
  }
  public async findByUserAndVerify(_id: string): Promise<any> {
    return await this.MODEL.find({ user_id: _id, deleted: false, verify: true });
  }
  public async findByPlateNumber(
    plate_number: string,
    customer_id: string
  ): Promise<any> {
    return await this.MODEL.findOne({
      plate_number,
      customer_id,
      status: true,
    });
  }
  public async findByids(_id: string): Promise<any> {
    return await this.MODEL.find({ _id });
  }
  public async findByCustomerAndName(
    customer_id: string,
    name: string,
  ): Promise<any> {
    return await this.MODEL.find({
      customer_id: customer_id,
      name: name,
      deleted: false
    });
  }
  public async updateOne(_id: String, updated: object): Promise<any> {
    return await this.MODEL.findByIdAndUpdate(_id, updated, { new: true, });
  }


  public async softDelete(_id: any, date_service: Date): Promise<any> {
    return await this.MODEL.findByIdAndUpdate(_id, { deleted: true, date_service }, { new: true })
  }

  public async PhysicalDelete(_id: any): Promise<any> {
    return await this.MODEL.deleteOne({ _id: _id })
  }
  public async DeletePinC(_id: any): Promise<any> {
    return await this.MODEL.deleteOne({ item: _id })
  }

  public async createOne(body: object): Promise<any> {

    const newObject = new this.MODEL(body);
    await newObject.save();
    return newObject;

  }

  public async findOneItem(query: Object, populateConfig1?: any, populateConfig2?: any, populateConfig3?: any): Promise<any> {

    return await this.MODEL.findOne({ ...query, deleted: false }).populate(
      populateConfig1).populate(populateConfig2).populate(populateConfig3);
  }
  public async findAllItems(query: Object, populateConfig1?: any, populateConfig2?: any, populateConfig3?: any): Promise<any> {

    return await this.MODEL.find({ ...query }).populate(
      populateConfig1).populate(populateConfig2).populate(populateConfig3);
  }

  public async search(search: string): Promise<any> {
    const noSpecialCharacters = search.replace(
      /[`~!@#$%^&*()_|+\-=?;:'"<>\{\}\[\]\\\/]/gi,
      ""
    );
    return await this.MODEL.find({
      $or: [
        {
          slug: { $regex: ".*" + noSpecialCharacters + ".*", $options: "i" },
        },
      ],
    });
  }

  public async getAllMembershipHistory(): Promise<any> {
    // const mongooseObjectId = new Types.ObjectId(id)
    const result = await this.MODEL.aggregate([
      //(padre) ---MembershipBenefits
      {
        $lookup: {
          from: "membershiphistories", // (hijo)--memberHistory
          let: {
            id: "$_id",
          },
          pipeline: [
            //(hijo)--memberHistory
            {
              $match: {
                $expr: {
                  $eq: ["$$id", "$membershipBenefit_id"],
                },
              },
            },
          ],
          as: "MembershipHistoryList",
        },
      },
      // {
      //   $match: {
      //     $and: [{ "MembershipHistoryList.deleted": true }],

      //   },
      // },
    ]);
    return result
  };


  public async getMembershipDetailHistory(id: string): Promise<any> {
    // const mongooseObjectId = new Types.ObjectId(id)
    const result = await this.MODEL.aggregate([
      //(padre) ---MembershipBenefits
      {
        $lookup: {
          from: "membershiphistories", // (hijo)--memberHistory
          let: {
            id: "$_id",
          },
          pipeline: [
            //(hijo)--memberHistory
            {
              $match: {
                $expr: {
                  $eq: ["$$id", "$membershipBenefit_id"],
                },
              },
            },
          ],
          as: "MembershipHistoryList",
        },
      },
      // {
      //   $match: {
      //     $and: [{ "MembershipHistoryList.deleted": false }],

      //   },
      // },
    ]);
    const info = result.filter(item => item._id == id);
    return info;
  };
  public async getMembershipDetailHistoryUser(id: string): Promise<any> {
    const result = await this.MODEL.aggregate([
      { $match: { client_id: id } },
      { $lookup: { from: "membershiphistories", localField: "_id", foreignField: "membershipBenefit_id", as: "MembershipHistoryList" } },
      { $lookup: { from: "services", localField: "service_id", foreignField: "_id", as: "NameService" } }
    ]);

    return result;
  };


}

