import Month from './Month';
import css from './Calendar.module.css';

export interface CalendarProps {
    year: number;
    /** Month offset from the start of the year, 0-11. */
    month: number;
    /** Select a range of dates instead of a single one. */
    selectRange?: boolean;
    /**
     * Called when a day is clicked. Without `selectRange` the click is the
     * whole selection and `second` is null.
     */
    onDateSelected?: (first: Date, second: Date | null) => void;
}

/** A month grid with a title. */
const Calendar = ({
    month,
    year,
    selectRange = false,
    onDateSelected = () => {},
}: CalendarProps) => {
    const day = new Date(year, month, 1);
    const serializer = new Intl.DateTimeFormat('default', { month: 'long', year: 'numeric' });

    return (
        <div className={css.calendar}>
            <div className={css.calendarPreamble}>{serializer.format(day)}</div>
            <Month
                month={month}
                year={year}
                selectRange={selectRange}
                onDateSelected={onDateSelected}
            />
        </div>
    );
};

export default Calendar;
