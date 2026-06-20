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
        "All",
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

    // TODO use start html elements? or react?
    return <div className="month-year-filter">
        <form onSubmit={handleSubmitFilter}>
            <Select
                id={'month'}
                onChange={(_ev, selection: SelectOnChangeData) => {
                    const monthIdx: number = months.findIndex((value: string) => value === selection.value);
                    setMonth(monthIdx != 0 ? monthIdx : undefined);
                }}
            >
                {months.map((month: string) => (<option key={month}>{month}</option>))}
            </Select>
            <Input
                id={'year'}
                type={'number'}
                onChange={(_ev, input: InputOnChangeData) => {
                    const parsedYear: number = parseInt(input.value);
                    setYear(parsedYear != 0 && !isNaN(parsedYear) ? parsedYear : undefined)
                }}
            />
            <Button type="submit" appearance="primary">Filter</Button>
        </form>
    </div>
    
    
}

export default MonthYearFilter;