import {BadgeInputProps, Result} from "../../data/types";
import React from "react";
import {Badge} from "@radix-ui/themes/dist/esm";
import {CalendarIcon} from "@radix-ui/react-icons";
import {todayIso, toIso} from "../../data/utils";
import DatePicker, {registerLocale} from "react-datepicker";
import {nb as norway} from "date-fns/locale/nb";

registerLocale('nb', norway);

export default function DatePickerBadge({selectedDate, results, onChangeDate, isAdmin}: Readonly<{
    selectedDate: Date,
    results: Result[],
    onChangeDate: (date: string) => void,
    isAdmin: boolean
}>) {

    const includedDates = React.useMemo(
        () =>
            results
                .map(result => result.date)
                .sort((a, b) => a.getTime() - b.getTime()),
        [results]
    );



    const minDate = includedDates[0];
    const maxDate = new Date();

    if (isAdmin) {
        return <DatePicker
            portalId='dp-portal'
            locale='nb'
            dateFormat='d. MMMM yyyy'
            selected={selectedDate}
            maxDate={maxDate}
            onChange={(date) => {
                if (date) {
                    onChangeDate(toIso(date))
                }
            }}
            filterDate={(d) => (d.getDay() !== 0 && d.getDay() !== 6)}
            customInput={<BadgeDateInput/>}
        />
    }

    return (
        <DatePicker
            portalId='dp-portal'
            locale='nb'
            dateFormat='d. MMMM yyyy'
            selected={selectedDate}
            includeDates={isAdmin ? [] : includedDates}
            minDate={minDate}
            onChange={(date) => {
                if (date) {
                    onChangeDate(toIso(date))
                }
            }}
            customInput={<BadgeDateInput/>}
        />
    )
}

const BadgeDateInput = ({ref, value, onClick}: BadgeInputProps & {
    ref?: React.RefObject<HTMLButtonElement | null>
}) => (
    <Badge asChild className='badge-button' color='gray' variant='soft' size='3'>
        <button
            type='button'
            ref={ref}
            onClick={onClick}
            aria-label='Velg dato'
            title='Velg dato'
            style={{cursor: 'pointer'}}>
                <span className='calendar-display' style={{display: 'inline-flex', alignItems: 'center', gap: 6}}>
                    <CalendarIcon width={16} height={16}/>
                    <span>{value ?? todayIso()}</span>
                </span>
        </button>
    </Badge>
);
BadgeDateInput.displayName = 'BadgeDateInput';

export function injectHeatmapCss() {
    // No longer injecting heatmap colors
}
