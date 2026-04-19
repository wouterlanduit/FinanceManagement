
import { useState } from "react";
import MonthlyDetailsGrid from "../components/MonthlyDetailsGrid/MonthlyDetailsGrid";
import { type DataSource } from "../services/data-source-service";
import MonthYearFilter from "../components/MonthYearFilter/MonthYearFilter";

export interface IExpensesProps {
    datasource: DataSource
}
function Expenses(props: IExpensesProps) {
    const [month, setMonth] = useState<number | undefined>(undefined);
    const [year, setYear] = useState<number | undefined>(undefined);

    return <div className="content">

        <MonthYearFilter
            updateValues={(y?: number, m?: number) => {
                setYear(y);
                setMonth(m)
            }}
        />

        <MonthlyDetailsGrid
            name="Details"
            month={month}
            year={year}
            source={props.datasource}
            _ISDEBUG_={window.location.hostname === 'localhost'}
        />
    </div>;
}

export default Expenses;
