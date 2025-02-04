import mongoose, { ObjectId } from "mongoose";
export interface ITaxInfoEntity  {
    _id              :   ObjectId;
    user             :   ObjectId;
    legal_name       :   string;
    tax_id           :   string;
    tax_system       :   number;
    email            ?:   string;
    phone            ?:   number;
    default_invoice_use ?:   string;
    address          :   ITaxAddress;
    status           :   boolean; 
    facturapi_id     : string;       
    createdAt       ?:   NativeDate;
    updatedAt       ?:   NativeDate;
}

export interface ITaxAddress {
    street          :   string;
    exterior        :   number;
    interior        :   number;
    neighborhood    :   string;
    city            :   string;
    municipality    :   string;
    zip             :   number;
    state           :   string;
    country         :   string;
}