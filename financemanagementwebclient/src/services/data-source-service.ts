import type { ReceiptDTO } from '../models/receipt-dto';

export class DataSource {
    useDummyData: boolean = false;


}

export class DataSourceService {
    useDummyData: boolean = false

    public static async loadReceipts(source: DataSource): Promise<ReceiptDTO[]> {
        if (source.useDummyData) {
            return this.loadDummyReceipts();
        } else {
            return this.loadAPIReceipts();
        }
    }

    private static async loadDummyReceipts(): Promise<ReceiptDTO[]> {
        return [
            {
                date: new Date(2025, 8, 3),
                source: "Store_1",
                amount: 20.05
            },
            {
                date: new Date(2025, 8, 9),
                source: "Store_2",
                amount: 10.05
            },
            {
                date: new Date(2025, 8, 13),
                source: "Store_3",
                amount: 18.62
            },
        ];
    }

    private static async loadAPIReceipts(): Promise<ReceiptDTO[]> {
        throw new Error("Not implemented");
    }
}