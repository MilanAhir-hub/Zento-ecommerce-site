// types/index.ts
export interface IUserActivity {
    userId: string;
    productId: string;
    action: 'view' | 'purchase' | 'like';
    createdAt?: Date;
}

export interface IProduct {
    _id: string;
    name: string;
    category: string;
    price: number;
    brand?: string;
}