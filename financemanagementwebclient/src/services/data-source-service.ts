import type { ReceiptDTO, ReceiptResponseJSON } from '../models/receipt-dto';
import type { SourceDTO, SourceResponseJSON } from '../models/source-dto';

export interface DataSource {
    useDummyData: boolean;

    loadReceipts(): Promise<ReceiptDTO[]>;
    loadSources(): Promise<SourceDTO[]>;

    addReceipt(receipt: ReceiptDTO): Promise<boolean>;
    addSource(source: SourceDTO): Promise<boolean>;
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

    public async addSource(source: SourceDTO): Promise<boolean> {
        return this.sources.push(source) > 0;
    }
}

export class AIPDataSource implements DataSource {
    useDummyData: boolean = false;
    bearerToken: string = "";
    backendUrl: string = "http://localhost:5265";
    sources: SourceDTO[] = [];

    public async getBearerToken(): Promise<string> {
        if (this.bearerToken === "") {
            // TODO get bearer
            const resp: Response = await fetch(this.backendUrl + "/login?name=API&apiKey=test", {
                method: "POST"
            });
            if (!resp.ok) {
                throw new Error("Failed to login.");
            }
            // TODO womee: return json with token en expiry
            const jsonResult = await resp.text();
            // TODO do we need to get a specific property?
            this.bearerToken = jsonResult;
        }

        return this.bearerToken;
    }

    public async loadReceipts(): Promise<ReceiptDTO[]> {
        await this.loadSources();

        const bearerToken: string = await this.getBearerToken();
        const request: Request = new Request(this.backendUrl + "/receipts");
        request.headers.set("Authorization", "Bearer " + bearerToken);
        const resp: Response = await fetch(request);
        if (!resp.ok) {
            throw new Error("Failed to fetch receipts.");
        }

        const jsonResult: ReceiptResponseJSON[] = await resp.json();

        return jsonResult.map(value => {
            return {
                id: value.id ?? 0,
                amount: value.amount ?? 0,
                date: new Date(value.date ?? ""),
                sourceid: value.sourceId ?? 0,
                sourcename: this.translateSourceId(value.sourceId ?? 0)
            }
        });
    }

    private translateSourceId(sourceId: number): string {
        return this.sources.find((source: SourceDTO) => {
            return source.id === sourceId;
        })?.name ?? "";
    }

    public async addReceipt(_receipt: ReceiptDTO): Promise<boolean> {
        let ret: boolean = false;

        const requestBody: string = JSON.stringify({
            sourceid: _receipt.sourceid,
            amount: _receipt.amount,
            date: _receipt.date.toISOString()
        });

        if (!this.executeCreate(requestBody, "/receipts")) {
            console.error("Failed to create receipt.");
        } else {
            ret = true;
        }

        return ret;
    }

    public async loadSources(): Promise<SourceDTO[]> {
        if (this.sources.length <= 0) {
            const bearerToken: string = await this.getBearerToken();
            const request: Request = new Request(this.backendUrl + "/sources");
            request.headers.set("Authorization", "Bearer " + bearerToken);

            const resp: Response = await fetch(request);
            if (!resp.ok) {
                throw new Error("Failed to fetch sources.");
            }

            const jsonResult: SourceResponseJSON[] = await resp.json();

            this.sources = jsonResult.map(value => {
                return {
                    id: value.id ?? 0,
                    name: value.name ?? 0
                }
            });
        }

        return this.sources;
    }

    public async addSource(_source: SourceDTO): Promise<boolean> {
        let ret: boolean = false;

        const requestBody: string = JSON.stringify({
            name: _source.name
        });

        if (!this.executeCreate(requestBody, "/sources")) {
            console.error("Failed to create source.");
        } else {
            ret = true;
        }

        return ret;
    }

    private async executeCreate(_body: string, _endpoint: string): Promise<boolean> {
        let ret: boolean = false;
        const bearerToken: string = await this.getBearerToken();
        const request: Request = new Request(
            this.backendUrl + _endpoint,
            {
                method: "POST",
                body: _body,
            }
        );
        request.headers.set("Authorization", "Bearer " + bearerToken);
        request.headers.set("Content-Type", "application/json");

        const resp: Response = await fetch(request);
        if (resp.ok) {
            ret = true;
        }

        return ret;
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