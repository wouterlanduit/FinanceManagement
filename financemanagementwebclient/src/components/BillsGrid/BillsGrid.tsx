import { useState } from 'react';
import type { BillDTO } from '../../models/bill-dto';
import { type DataSource, DataSourceService }  from '../../services/data-source-service'
import { createTableColumn, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow, Toolbar, ToolbarButton, useTableFeatures, useTableSort, type TableColumnDefinition, type TableColumnId } from '@fluentui/react-components';
import AddRecordDialog, { type AddRecordDialogField } from '../AddRecordDialog/AddRecordDialog';
import type { SourceDTO } from '../../models/source-dto';
import type { IBillFilter } from '../../models/types';

export interface IBillsGridProps {
    month?: number,
    year?: number,
    _ISDEBUG_: boolean,
    source: DataSource
}


const columns: TableColumnDefinition<BillDTO>[] = [
    createTableColumn<BillDTO>({
        columnId: "date",
        compare: (a, b) => {
            return a.date.getTime() - b.date.getTime();
        },
        renderHeaderCell: () => {
            return "Date";
        },
        renderCell: (item) => {
            return item.date.toLocaleDateString('nl-be');   // TODO config/cookie
        }
    }),
    createTableColumn<BillDTO>({
        columnId: "datePayed",
        compare: (a, b) => {
            return a.datePayed.getTime() - b.datePayed.getTime();
        },
        renderHeaderCell: () => {
            return "Date payed";
        },
        renderCell: (item) => {
            return item.datePayed.toLocaleDateString('nl-be');   // TODO config/cookie
        }
    }),
    createTableColumn<BillDTO>({
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
    createTableColumn<BillDTO>({
        columnId: "source",
        compare: (a, b) => {
            return a.sourcename.localeCompare(b.sourcename);
        },
        renderHeaderCell: () => {
            return "Source";
        },
        renderCell: (item) => {
            return item.sourcename;
        }
    })
]

function BillsGrid(props: IBillsGridProps) {
    const [bills, setBills] = useState<BillDTO[] | null>(null);
    const [sources, setSources] = useState<SourceDTO[] | null>(null);
    const [fetchingData, setFetchingData] = useState<boolean>(false);
    const [currentMonth, setCurrentMonth] = useState<number | undefined>(0);
    const [currentYear, setCurrentYear] = useState<number | undefined>(0);

    const fetchData = async () => {
        try {
            setBills(await FetchBills(props.source, { month: props.month, year: props.year }));
            setSources(await FetchSources(props.source));
            setCurrentMonth(props.month);
            setCurrentYear(props.year);
        }
        finally {
            setFetchingData(false);
        }
    }

    const triggerDataFetch = () => {
        if (fetchingData === false) {
            fetchData(); //TODO show error?
            setFetchingData(true)
        }
    }

    if ((bills === null || currentMonth != props.month || currentYear != props.year) && fetchingData === false) {
        triggerDataFetch();
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
            items: bills ?? []
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

    const sourceDictionary: { [id: string]: string } = {};
    sources?.forEach((value: SourceDTO) => sourceDictionary[value.id.toString()] = value.name);

    const dialogFields: AddRecordDialogField<BillDTO>[] = [
        {
            name: "source",
            type: "combobox",
            required: true,
            setValue: (dto: BillDTO, value: string) => {
                dto.sourceid = Number(value);
                dto.sourcename = sources?.find((source: SourceDTO) => {
                    return source.id === dto.sourceid;
                })?.name ?? "";
            },
            options: sourceDictionary
        },
        {
            name: "amount",
            type: "number",
            required: true,
            setValue: (dto: BillDTO, value: string) => {
                dto.amount = Number(value);
            }
        },
        {
            name: "date",
            type: "date",
            required: true,
            setValue: (dto: BillDTO, value: string) => {
                dto.date = new Date(value);
            }
        },
        {
            name: "datePayed",
            type: "date",
            required: true,
            setValue: (dto: BillDTO, value: string) => {
                dto.datePayed = new Date(value);
            }
        }
    ]

    return (
        <>
            <Toolbar>
                <AddRecordDialog<BillDTO>
                    _ISDEBUG_={props._ISDEBUG_}
                    fields={dialogFields}
                    initRecord={() => {
                        return {
                            id: 0,
                            amount: 0,
                            sourceid: 0,
                            sourcename: "",
                            date: new Date(),
                            datePayed: new Date()
                        };
                    }}
                    createRecord={async (a: BillDTO) => {
                        const created = await props.source.addBill(a);
                        if (created) {
                            console.log(`record created. source:${a.sourcename} - amount: ${a.amount} - date:${a.date.toLocaleDateString('nl-be')}`);
                            triggerDataFetch();
                        }
                        return created;
                    }}
                />
                <ToolbarButton aria-label="Refresh" onClick={triggerDataFetch}>Refresh</ToolbarButton>
            </Toolbar>
            

            {bills != null &&
                <Table
                    noNativeElements={true}
                    role="grid"
                    sortable
                    size="small"
                    style={{ minWidth: "475px" }}
                >
                    <TableHeader>
                        <TableRow key="header">
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
                                    <TableCell key={`${row.item.id}_${column.columnId}`}>
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

async function FetchBills(source: DataSource, filter: IBillFilter): Promise<BillDTO[]> {
    return await DataSourceService.loadBills(source, filter);
}

async function FetchSources(source: DataSource): Promise<SourceDTO[]> {
    return await DataSourceService.loadSources(source);
}

export default BillsGrid;