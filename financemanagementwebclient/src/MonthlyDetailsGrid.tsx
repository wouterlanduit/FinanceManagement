/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import type { ReceiptDTO } from './models/receipt-dto';
import { DataSource, DataSourceService }  from './services/data-source-service'
import { createTableColumn, DataGrid, DataGridBody, DataGridCell, DataGridHeader, DataGridHeaderCell, DataGridRow, type TableColumnDefinition } from '@fluentui/react-components';

export interface IMonthlyDetailsGridProps {
    name: string,
    _ISDEBUG_: boolean,
    source: DataSource
}


const columns: TableColumnDefinition<ReceiptDTO>[] = [
    createTableColumn<ReceiptDTO>({
        columnId: "date",
        compare: (a, b) => {
            return a.date.getTime() - b.date.getTime();
        },
        renderHeaderCell: () => {
            return "Date";
        },
        renderCell: (item) => {
            return item.date.toLocaleDateString('nl-be');
        }
    }),
    createTableColumn<ReceiptDTO>({
        columnId: "amount",
        compare: (a, b) => {
            return a.amount - b.amount;
        },
        renderHeaderCell: () => {
            return "Amount";
        },
        renderCell: (item) => {
            return item.amount;
        }
    }),
    createTableColumn<ReceiptDTO>({
        columnId: "source",
        compare: (a, b) => {
            return a.source.localeCompare(b.source);
        },
        renderHeaderCell: () => {
            return "Source";
        },
        renderCell: (item) => {
            return item.source;
        }
    })
]

function MonthlyDetailsGrid(props: IMonthlyDetailsGridProps) {
    const [data, setData] = useState<ReceiptDTO[] | null>(null);
    const [fetchingData, setFetchingData] = useState<boolean>(false);

    if (data === null && fetchingData === false) {
        GetData(props.source).then((value: ReceiptDTO[]) => {
            setData(value);
            setFetchingData(false);
        }).catch(() => setFetchingData(false)); //TODO show error?
        setFetchingData(true);
    }

    return (
        <>
            {props._ISDEBUG_ && <p> { "DEBUG ENABLED"}</p>}
            <p>{props.name}</p>

            {data != null &&
                <DataGrid
                    items={data}
                    columns={columns}
                    sortable
                    getRowId={(item) => item.source}
                    style={{ minWidth: "550px" }}
                >
                    <DataGridHeader>
                        <DataGridRow>
                            {({ renderHeaderCell }) => (
                                <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                            )}
                        </DataGridRow>
                    </DataGridHeader>
                    <DataGridBody<ReceiptDTO>>
                        {({ item, rowId }) => (
                            <DataGridRow<ReceiptDTO>
                                key={rowId}
                            >
                                {({ renderCell }) => (
                                    <DataGridCell>{renderCell(item)}</DataGridCell>
                                )}
                            </DataGridRow>
                        )}
                    </DataGridBody>
                </DataGrid>
            }
        </>
    );
}

async function GetData(source: DataSource): Promise<ReceiptDTO[]> {
    return await DataSourceService.loadReceipts(source);
}

export default MonthlyDetailsGrid;