export interface Category {
    name: string;
    description: string;
    status: boolean;
}

export interface Subcategory {
    name: string;
    desription: string;
    status: boolean;
    category: Category;
}