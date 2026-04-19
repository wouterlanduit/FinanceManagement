
import { useState } from "react";
import MonthlyDetailsGrid from "../components/MonthlyDetailsGrid/MonthlyDetailsGrid";
import { type DataSource } from "../services/data-source-service";
import MonthYearFilter from "../components/MonthYearFilter/MonthYearFilter";

export interface IExpensesProps {
    datasource: DataSource
}

function formatHeader(yr?: number, mth?: number): string {
    let ret: string = "All";

    if (yr != undefined && mth != undefined) {
        ret = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date(yr ?? 0, (mth ?? 0) - 1));
    } else if (yr != undefined) {
        ret = new Intl.DateTimeFormat("en-US", { year: "numeric" }).format(new Date(yr ?? 0, 0));
    } else if (mth != undefined) {
        ret = new Intl.DateTimeFormat("en-US", { month: "long"}).format(new Date(2000, (mth ?? 0) - 1));
    }

    return ret;
}

function Expenses(props: IExpensesProps) {
    const [month, setMonth] = useState<number | undefined>(undefined);
    const [year, setYear] = useState<number | undefined>(undefined);

    return <div className="content">
        <h1>{formatHeader(year, month)}</h1>

        <MonthYearFilter
            updateValues={(yr?: number, mth?: number) => {
                setYear(yr);
                setMonth(mth)
            }}
        />

        <MonthlyDetailsGrid
            month={month}
            year={year}
            source={props.datasource}
            _ISDEBUG_={window.location.hostname === 'localhost'}
        />
    </div>;
}

export default Expenses;
