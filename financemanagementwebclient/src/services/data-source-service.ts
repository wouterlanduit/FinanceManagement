import type { ReceiptDTO } from '../models/receipt-dto';
import type { SourceDTO } from '../models/source-dto';

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
                id: 1,
                date: new Date(2025, 8, 3),
                source: "Store_1",
                amount: 20.05
            },
            {
                id: 2,
                date: new Date(2025, 8, 9),
                source: "Store_2",
                amount: 10.05
            },
            {
                id: 3,
                date: new Date(2025, 8, 13),
                source: "Store_3",
                amount: 18.62
            },
        ];
    }

    private static async loadDummySources(): Promise<SourceDTO[]> {
        return [
            {
                id: 1,
                name: "Store_1"
            },
            {
                id: 2,
                name: "Store_2"
            },
            {
                id: 3,
                name: "Store_3"
            },
        ];
    }

    private static async loadAPIReceipts(): Promise<ReceiptDTO[]> {
        throw new Error("Not implemented");
    }
}