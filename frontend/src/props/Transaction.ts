import { User } from "./User";

export interface Transaction {
    id: number;
    category: Category;
    account: Account;
    amount: number;
    type: 'income' | 'expense';
    description: string;
    date: string;
    user: User;
}

export interface Category {
    id: number;
    name: string;
}

export interface Account {
    id: number;
    name: string;
    type: string;
    balance: number;
}

export interface Goal {
    id: number;
    name: string;
    target_amount: number;
    current_amount: number;
    deadline: string;
}
