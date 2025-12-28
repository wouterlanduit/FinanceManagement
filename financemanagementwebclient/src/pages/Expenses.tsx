import MonthlyDetailsGrid from "../components/MonthlyDetailsGrid/MonthlyDetailsGrid";
import { type DataSource } from "../services/data-source-service";

export interface IExpensesProps {
    datasource: DataSource
}
function Expenses(props: IExpensesProps) {
    return <div className="content">
        <MonthlyDetailsGrid
            name="September"
            source={props.datasource}
            _ISDEBUG_={window.location.hostname === 'localhost'}
        />
    </div>;
}

export default Expenses;