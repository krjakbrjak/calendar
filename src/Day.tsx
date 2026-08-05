import { getToday, isToday } from './helpers';

import css from './Day.module.css';

export interface DayProps {
    year?: number;
    /** Month offset from the start of the year, 0-11. */
    month?: number;
    /** Day offset from the start of the month. */
    date?: number;
    onSelected?: (date: Date) => void;
}

/**
 * A single clickable day cell. Styling reflects whether the date is a weekday,
 * a weekend, today, or belongs to an adjacent month.
 */
const Day = ({
    year = getToday().year,
    month = getToday().month,
    date = getToday().date,
    onSelected = () => {},
}: DayProps) => {
    const tmp = new Date(year, month, date);

    let className = css.day;
    if ([0, 6].includes(tmp.getDay())) {
        className = `${className} ${css.weekend}`;
    } else {
        className = `${className} ${css.weekday}`;
    }

    if (isToday(tmp)) {
        className = `${className} ${css.today}`;
    }

    if (tmp.getMonth() !== month) {
        className = `${className} ${css.otherMonth}`;
    }

    return (
        <button type="button" onClick={() => onSelected(tmp)} className={className}>
            {tmp.getDate()}
        </button>
    );
};

export default Day;
