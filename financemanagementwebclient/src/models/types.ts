export type ColumnType = "date" | "number" | "text" | "combobox";

export interface IReceiptFilter {
    month?: number,
    year?: number
}