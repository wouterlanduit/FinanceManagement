import { useState } from 'react';
import type { ReceiptDTO } from './models/receipt-dto';
import { DataSource, DataSourceService }  from './services/data-source-service'
import { createTableColumn, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow, useTableFeatures, useTableSort, type TableColumnDefinition, type TableColumnId } from '@fluentui/react-components';
import AddRecordDialog, { type AddRecordDialogField } from './AddRecordDialog';

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
            return item.date.toLocaleDateString('nl-be');   // TODO config
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

    const {
        getRows,
        sort: {
            getSortDirection,
            toggleColumnSort,
            sort
        }
    } = useTableFeatures(
        {
            columns: columns,
            items: data ?? []
        },
        [
            useTableSort({
                defaultSortState: {
                    sortColumn: "date",
                    sortDirection: "ascending"
                }
            })
        ]
        );

    const headerSortProps = (columnId: TableColumnId) => ({
        onClick: (e: React.MouseEvent) => {
            toggleColumnSort(e, columnId);
        },
        sortDirection: getSortDirection(columnId),
    });

    const rows = sort(getRows());

    const dialogFields: AddRecordDialogField<ReceiptDTO>[] = [
        {
            name: "source",
            type: "text",
            required: true,
            setValue: (dto: ReceiptDTO, value: string) => {
                dto.source = value;
            }
        },
        {
            name: "amount",
            type: "number",
            required: true,
            setValue: (dto: ReceiptDTO, value: string) => {
                dto.amount = Number(value);
            }
        },
        {
            name: "date",
            type: "date",
            required: true,
            setValue: (dto: ReceiptDTO, value: string) => {
                dto.date = new Date(value);
            }
        }
    ]

    //TODO check if we can use row.rowId as row key
    return (
        <>
            {props._ISDEBUG_ && <p> { "DEBUG ENABLED"}</p>}
            <p>{props.name}</p>

            <AddRecordDialog<ReceiptDTO>
                _ISDEBUG_={props._ISDEBUG_}
                fields={dialogFields}
                initRecord={() => {
                    return {
                        id: 0,
                        amount: 0,
                        source: "",
                        date: new Date()
                    };
                }}
                createRecord={(a: ReceiptDTO) => {
                    console.log(`record created. source:${a.source} - amount: ${a.amount} - date:${a.date.toLocaleDateString('nl-be')}`);
                    return a.amount > 0;
                }}
            />

            {data != null &&
                <Table
                    noNativeElements={true}
                    role="grid"
                    sortable
                    size="small"
                    style={{ minWidth: "475px" }}
                >
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => (
                                <TableHeaderCell
                                    key={column.columnId}
                                    {...headerSortProps(column.columnId)}
                                >
                                    {column.renderHeaderCell()}
                                </TableHeaderCell>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.item.id}>
                                {columns.map((column) => (
                                    <TableCell>
                                        {column.renderCell(row.item)}
                                    </TableCell>))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            }
        </>
    );
}

async function GetData(source: DataSource): Promise<ReceiptDTO[]> {
    return await DataSourceService.loadReceipts(source);
}

export default MonthlyDetailsGrid;