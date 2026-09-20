import { useState } from 'react';
import { type DataSource } from "../services/data-source-service";
import MonthlySummaryGrid from "../components/MonthlySummaryGrid/MonthlySummaryGrid";
import { Tab, TabList, type SelectTabData, type SelectTabEvent, type TabValue } from "@fluentui/react-components";

export interface ISummaryProps {
    datasource: DataSource
}

function Summary(props: ISummaryProps) {
    const [selectedValue, setSelectedValue] = useState<TabValue>("2026");

    const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
        setSelectedValue(data.value);
    };

    // TODO: dynamic tabs (not hardcoded)
    return <div className="content">
        <TabList selectedValue={selectedValue} onTabSelect={onTabSelect} vertical>
            <Tab id="2025" value="2025">
                2025
            </Tab>
            <Tab id="2026" value="2026">
                2026
            </Tab>
        </TabList>
        <MonthlySummaryGrid
            source={props.datasource}
            year={typeof selectedValue === "string" ? parseInt(selectedValue) : 0}
        />
    </div>;
}

export default Summary;
