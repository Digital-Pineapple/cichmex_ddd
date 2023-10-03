
export interface ICarService {
    _id              :   string;
    name             :   string;
    status           ?:   boolean;
    typeCar_image    ?:   string;
    price            ?:   number;
    createdAt       ?:   NativeDate;
    updatedAt       ?:   NativeDate;
}
