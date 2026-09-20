export interface BillDTO {
    id?: number;
    sourcename: string;
    sourceid: number;
    amount: number;
    date: Date;
    datePayed: Date;
}

export interface BillResponseJSON {
    id?: number;
    sourceId?: number;
    amount?: number;
    date?: string;
    datePayed?: string;
}