import MonthlyDetailsGrid from "../components/MonthlyDetailsGrid/MonthlyDetailsGrid";
import { AIPDataSource, DummyDataSource, type DataSource } from "../services/data-source-service";

function Expenses() {
    const ds: DataSource = new DummyDataSource();//new AIPDataSource();
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