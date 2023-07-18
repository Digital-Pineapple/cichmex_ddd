import { Category } from "../category/CategoryEntity";

export interface SubCategory {
    name: string;
    description: string;
    status: boolean;
    subCategory_image : string;
    category: Category;
}

