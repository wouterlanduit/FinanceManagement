export interface MonthSummaryDTO {
    id?: number;
    year: number;
    month: number;
    rent: number;
    total: number;
}

export interface MonthSummaryResponseJSON {
    id?: number;
    year?: number;
    month?: number;
    rent?: number;
    utilities?: number;
    food?: number;
    nonFood?: number;
    total?: number;
}