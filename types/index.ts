import { ReactNode } from "react";

export interface IStock {
    name: string;
    price: number;
    color: string;
    chart: [];
    id: string;
}

export interface StatItem {
    title: string;
    value: string;
    trend: string | number;
    icon: ReactNode;
    id: string;
}
