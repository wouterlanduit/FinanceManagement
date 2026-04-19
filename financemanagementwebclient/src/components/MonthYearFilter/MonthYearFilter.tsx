import './MonthYearFilter.css'
import { useState } from 'react';
import { Button, Input, Select, type InputOnChangeData, type SelectOnChangeData } from '@fluentui/react-components';

export interface IMonthYearFilterProps {
    updateValues: (year?: number, month?: number) => void
}

function MonthYearFilter(props: IMonthYearFilterProps) {
    const [month, setMonth] = useState<number | undefined>(undefined);
    const [year, setYear] = useState<number | undefined>(undefined);
    
    const handleSubmitFilter = (ev: React.FormEvent) => {
        ev.preventDefault();

        console.debug("Filtering...")

        props.updateValues(year, month);
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

    return <form onSubmit={handleSubmitFilter}>
        <Select
            id={'month'}
            onChange={(_ev, selection: SelectOnChangeData) => {
                setMonth(months.findIndex((value: string) => value === selection.value) + 1)
            }}
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
}

export default MonthYearFilter;