import { useState } from 'react';
import type { MonthSummaryDTO } from '../../models/month-summary-dto';
import { type DataSource, DataSourceService }  from '../../services/data-source-service'
import { createTableColumn, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow, Toolbar, ToolbarButton, useTableFeatures, useTableSort, type TableColumnDefinition, type TableColumnId } from '@fluentui/react-components';

export interface IMonthlySummaryGridProps {
    source: DataSource
}


const columns: TableColumnDefinition<MonthSummaryDTO>[] = [
    createTableColumn<MonthSummaryDTO>({
        columnId: "year",
        compare: (a, b) => {
            return a.year - b.year;
        },
        renderHeaderCell: () => {
            return "Year";
        },
        renderCell: (item) => {
            return item.year;
        }
    }),
    createTableColumn<MonthSummaryDTO>({
        columnId: "month",
        compare: (a, b) => {
            return a.month - b.month;
        },
        renderHeaderCell: () => {
            return "Month";
        },
        renderCell: (item) => {
            return item.month;
        }
    }),
    createTableColumn<MonthSummaryDTO>({
        columnId: "rent",
        compare: (a, b) => {
            return a.rent - b.rent;
        },
        renderHeaderCell: () => {
            return "Rent";
        },
        renderCell: (item) => {
            return item.rent;
        }
    }),
    createTableColumn<MonthSummaryDTO>({
        columnId: "total",
        compare: (a, b) => {
            return a.total - b.total;
        },
        renderHeaderCell: () => {
            return "Total";
        },
        renderCell: (item) => {
            return item.total;
        }
    })
]

function MonthlySummaryGrid(props: IMonthlySummaryGridProps) {
    const [monthSummaries, setMonthSummaries] = useState<MonthSummaryDTO[] | null>(null);
    const [fetchingData, setFetchingData] = useState<boolean>(false);

    const fetchData = async () => {
        try {
            setMonthSummaries(await FetchMonthSummaries(props.source));
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

    if ((monthSummaries === null) && fetchingData === false) {
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
            items: monthSummaries ?? []
        },
        [
            useTableSort({
                defaultSortState: {
                    sortColumn: "year",
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

    return (
        <>
            <Toolbar>
                <ToolbarButton aria-label="Refresh" onClick={triggerDataFetch}>Refresh</ToolbarButton>
            </Toolbar>
            

            {monthSummaries != null &&
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

async function FetchMonthSummaries(source: DataSource): Promise<MonthSummaryDTO[]> {
    return await DataSourceService.loadMonthSummaries(source);
}

export default MonthlySummaryGrid;