export interface SubCategory {
    name: string;
    description: string;
    status: boolean;
    category: Category;
}

export interface Category {
    name: string;
    description: string;
    status: boolean; 
}