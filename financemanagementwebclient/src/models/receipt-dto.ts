export interface ReceiptDTO {
    id?: number;
    sourcename: string;
    sourceid: number;
    amount: number;
    date: Date;
}

export interface ReceiptResponseJSON {
    id?: number;
    sourceId?: number;
    amount?: number;
    date?: string;
}