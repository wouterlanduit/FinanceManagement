import { useState } from 'react';
import { type DataSource }  from '../../services/data-source-service'
import { createTableColumn, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow, Toolbar, ToolbarButton, useTableFeatures, useTableSort, type TableColumnDefinition, type TableColumnId } from '@fluentui/react-components';
import AddRecordDialog, { type AddRecordDialogField } from '../AddRecordDialog/AddRecordDialog';
import type { SourceDTO } from '../../models/source-dto';

export interface ISimpleGridProps {
    _ISDEBUG_: boolean,
    source: DataSource,
    fetch: (datasource: DataSource) => Promise<SourceDTO[]>,
    //columns: TableColumnDefinition<SourceDTO>[]
}


const columns: TableColumnDefinition<SourceDTO>[] = [
    createTableColumn<SourceDTO>({
        columnId: "name",
        compare: (a, b) => {
            return a.name.localeCompare(b.name);
        },
        renderHeaderCell: () => {
            return "Name";
        },
        renderCell: (item) => {
            return item.name;
        }
    })
]

function SimpleGrid(props: ISimpleGridProps) {
    const [data, setData] = useState<SourceDTO[] | null>(null);
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

    const dialogFields: AddRecordDialogField<SourceDTO>[] = [
        {
            name: "name",
            type: "text",
            required: true,
            setValue: (dto: SourceDTO, value: string) => {
                dto.name = value;
            }
        }
    ]

    //TODO check if we can use row.rowId as row key
    return (
        <>
            <Toolbar>
                <AddRecordDialog<SourceDTO>
                    _ISDEBUG_={props._ISDEBUG_}
                    fields={dialogFields}
                    initRecord={() => {
                        return {
                            id: 0,
                            name: ""
                        };
                    }}
                    createRecord={async (a: SourceDTO) => {
                        const created = await props.source.addSource(a);
                        if (created) {
                            console.log(`record created. name:${a.name}`);
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

export default SimpleGrid;