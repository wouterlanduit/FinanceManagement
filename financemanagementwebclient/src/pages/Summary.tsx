import { useState } from 'react';
import { type DataSource } from "../services/data-source-service";
import MonthlySummaryGrid from "../components/MonthlySummaryGrid/MonthlySummaryGrid";
import { Tab, TabList, type SelectTabData, type SelectTabEvent, type TabValue } from "@fluentui/react-components";

export interface ISummaryProps {
    datasource: DataSource
}

// TODO build array dynamically?
const years: number[] = [2023,2024,2025,2026,2027];

function Summary(props: ISummaryProps) {
    const [selectedValue, setSelectedValue] = useState<TabValue>(years[0]);

    const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
        setSelectedValue(data.value);
    };

    return <div className="content">
        <TabList selectedValue={selectedValue} onTabSelect={onTabSelect} vertical>
            {years.map(year => <Tab id={`${year}`} value={year}>{year}</Tab>)}
        </TabList>
        <MonthlySummaryGrid
            source={props.datasource}
            year={YearValue(selectedValue)}
        />
    </div>;
}

function YearValue(tabValue: TabValue): number {
    let ret: number = 0;

    switch (typeof tabValue) {
        case "string":
            ret = parseInt(tabValue);
            break;
        case "number":
            ret = tabValue;
            break;
    }

    return ret;
}

export default Summary;
