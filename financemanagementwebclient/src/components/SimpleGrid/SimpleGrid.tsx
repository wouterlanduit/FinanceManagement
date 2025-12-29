import { useState } from 'react';
import { type DataSource }  from '../../services/data-source-service'
import { createTableColumn, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow, Toolbar, ToolbarButton, useTableFeatures, useTableSort, type TableColumnDefinition, type TableColumnId } from '@fluentui/react-components';
import AddRecordDialog, { type AddRecordDialogField } from '../AddRecordDialog/AddRecordDialog';
import type { ColumnType } from '../../models/types'

export interface SimpleGridColumn<T> {
    name: string;
    type: ColumnType;
    required: boolean;
    setValue: (dto: T, value: string) => void;
    renderValue: (item: T) => React.ReactNode;
    compare: (a: T, b: T) => number;
}

export interface ISimpleGridProps<T> {
    _ISDEBUG_: boolean,
    source: DataSource,
    fetch: (datasource: DataSource) => Promise<T[]>,
    columns: SimpleGridColumn<T>[],
    getRowId: (item: T) => number,
    initRecord: () => T,
    createRecord: (record: T) => Promise<boolean>
}

function SimpleGrid<T>(props: ISimpleGridProps<T>) {
    const [data, setData] = useState<T[] | null>(null);
    const [fetchingData, setFetchingData] = useState<boolean>(false);

    const fetchData = async () => {
        try {
            setData(await props.fetch(props.source));
        }
        finally {
            setFetchingData(false);
        }
    }

    const triggerDataFetch = () => {
        if (fetchingData === false) {
            setFetchingData(true)
            fetchData(); //TODO show error?
        }
    }

    if (data === null && fetchingData === false) {
        triggerDataFetch();
    }

    const columns: TableColumnDefinition<T>[] = props.columns.map(column => {
        return createTableColumn<T>({
            columnId: column.name,
            compare: (a, b) => {
                return column.compare(a, b);
            },
            renderHeaderCell: () => {
                return column.name;
            },
            renderCell: column.renderValue
        })
    });

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
                    sortColumn: "name",
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

    const dialogFields: AddRecordDialogField<T>[] = props.columns.map(column => {
        return {
            name: column.name,
            type: column.type,
            required: column.required,
            setValue: column.setValue
        }
    });

    //TODO check if we can use row.rowId as row key
    return (
        <>
            <Toolbar>
                <AddRecordDialog<T>
                    _ISDEBUG_={props._ISDEBUG_}
                    fields={dialogFields}
                    initRecord={props.initRecord}
                    createRecord={async (a: T) => {
                        const created = await props.createRecord(a);
                        if (created) {
                            console.log(`record created. name:${props.getRowId(a)}`);
                            triggerDataFetch();
                        }
                        return created;
                    }}
                />
                <ToolbarButton aria-label="Refresh" onClick={triggerDataFetch}>Refresh</ToolbarButton>
            </Toolbar>
            

            {data != null &&
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
                            <TableRow key={props.getRowId(row.item)}>
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

export default SimpleGrid;