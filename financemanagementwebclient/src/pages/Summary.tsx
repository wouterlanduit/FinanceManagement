
import { type DataSource } from "../services/data-source-service";
import MonthlySummaryGrid from "../components/MonthlySummaryGrid/MonthlySummaryGrid";

export interface ISummaryProps {
    datasource: DataSource
}

function Summary(props: ISummaryProps) {

    return <div className="content">

        <MonthlySummaryGrid
            source={props.datasource}
        />
    </div>;
}

export default Summary;
