import { Button, Input, Select, type InputOnChangeData, type SelectOnChangeData } from "@fluentui/react-components";
import { useState } from "react";
import MonthlyDetailsGrid from "../components/MonthlyDetailsGrid/MonthlyDetailsGrid";
import { type DataSource } from "../services/data-source-service";

export interface IExpensesProps {
    datasource: DataSource
}
function Expenses(props: IExpensesProps) {
    const [month, setMonth] = useState<number|undefined>(undefined);
    const [year, setYear] = useState<number|undefined>(undefined);
    // TODO add filter for month and year
    const handleSubmitFilter = (ev: React.FormEvent) => {
        ev.preventDefault();

        // TODO implement
        // TODO distinguish between submitted and unsubmitted filter
    };

    const months: string[] = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    return <div className="content">
        <form onSubmit={handleSubmitFilter}>
            <Select
                id={'month'}
                onChange={(_ev, selection: SelectOnChangeData) => {
                    setMonth(months.findIndex((value: string) => value === selection.value) + 1)
                } }
            >
                {months.map((month: string) => (<option key={month}>{month}</option>))}
            </Select>
            <Input
                id={'year'}
                type={'number'}
                onChange={(_ev, input: InputOnChangeData) => {
                    setYear(parseInt(input.value))
                }}
            />
            <Button type="submit" appearance="primary">Filter</Button>
        </form>
        

        <MonthlyDetailsGrid
            name="September"
            month={month}
            year={year}
            source={props.datasource}
            _ISDEBUG_={window.location.hostname === 'localhost'}
        />
    </div>;
}

export default Expenses;
