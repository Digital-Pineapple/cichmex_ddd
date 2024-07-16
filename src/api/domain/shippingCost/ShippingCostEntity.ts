

export interface ShippingCostEntity {

    starting_weight: number,
    end_weight?: number
    price_weight?: number,
    createdAt: NativeDate;
    updatedAt: NativeDate;
    status?: boolean;
}

