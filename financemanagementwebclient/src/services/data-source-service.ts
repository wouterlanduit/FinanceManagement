import type { ReceiptDTO } from '../models/receipt-dto';
import type { SourceDTO } from '../models/source-dto';

export interface DataSource {
    useDummyData: boolean;

    loadReceipts(): Promise<ReceiptDTO[]>;
    loadSources(): Promise<SourceDTO[]>;

    addReceipt(receipt: ReceiptDTO): Promise<boolean>;
}

export class DummyDataSource implements DataSource {
    useDummyData: boolean = true;
    receipts: ReceiptDTO[] = [
        {
            id: 1,
            date: new Date(2025, 8, 3),
            sourceid: 1,
            sourcename: "Store_1",
            amount: 20.05
        },
        {
            id: 2,
            date: new Date(2025, 8, 9),
            sourceid: 2,
            sourcename: "Store_2",
            amount: 10.05
        },
        {
            id: 3,
            date: new Date(2025, 8, 13),
            sourceid: 3,
            sourcename: "Store_3",
            amount: 18.62
        }
    ];
    sources: SourceDTO[] = [
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

    public async loadReceipts(): Promise<ReceiptDTO[]> {
        return this.receipts;
    }

    public async addReceipt(receipt: ReceiptDTO): Promise<boolean> {
        return this.receipts.push(receipt) > 0;
    }

    public async loadSources(): Promise<SourceDTO[]> {
        return this.sources;
    }
}

export class AIPDataSource implements DataSource {
    useDummyData: boolean = false;

    public async loadReceipts(): Promise<ReceiptDTO[]> {
        throw new Error("Not implemented");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async addReceipt(_receipt: ReceiptDTO): Promise<boolean> {
        throw new Error("Not implemented");
    }

    public async loadSources(): Promise<SourceDTO[]> {
        throw new Error("Not implemented");
    }
}

export class DataSourceService {
    useDummyData: boolean = false

    public static async loadReceipts(source: DataSource): Promise<ReceiptDTO[]> {
        return source.loadReceipts();
    }

    public static async addReceipt(receipt: ReceiptDTO, source: DataSource) {
        source.addReceipt(receipt);
    }

    public static async loadSources(source: DataSource): Promise<SourceDTO[]> {
        return source.loadSources();
    }
}