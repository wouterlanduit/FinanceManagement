import MonthlyDetailsGrid from "../components/MonthlyDetailsGrid/MonthlyDetailsGrid";
import { AIPDataSource, type DataSource } from "../services/data-source-service";

function Expenses() {
    const ds: DataSource = new AIPDataSource();
    ds.useDummyData = window.location.hostname === 'localhost';

    return (
        <MonthlyDetailsGrid
            name="September"
            source={ds}
            _ISDEBUG_={window.location.hostname === 'localhost'}
        />
    );
}

export default Expenses;