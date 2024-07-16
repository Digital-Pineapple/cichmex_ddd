

export interface ShippingCostEntity {
    uuid:string,
    starting_weight: number,
    end_weight?: number
    price_weight?: number,
    createdAt: NativeDate;
    updatedAt: NativeDate;
    status?: boolean;
}

export interface IShoppingCostResponse {
    price_weight : number,
}

