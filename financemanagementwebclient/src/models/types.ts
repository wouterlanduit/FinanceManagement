export type ColumnType = "date" | "number" | "text" | "combobox";

export interface IReceiptFilter {
    month?: number,
    year?: number
}

export interface IBillFilter {
    month?: number,
    year?: number
}

export interface IMonthSummaryFilter {
    month?: number,
    year?: number
}