import React from 'react';
import PropTypes from 'prop-types';

import Month from './Month';
import css from './Calendar.css';

/**
 * @callback Calendar.onDateSelected
 * @param {Date} first A date.
 * @param {Date} [second=null] A date (if the range is selected).
 * @returns void
 */

/**
 * @description Props for {@link Calendar} component.
 *
 * @typedef {Object} Calendar.Props
 * @property {Integer} [year=Current year] An year
 * @property {Integer} [month=Current month] A month offset from the start of the year.
 * @property {Boolean} [selectRange=false] An option to select either
 * a single date or a rnage of dates.
 * @property {Calendar.onDateSelected} [onDateSelected=null] A callback that is executed when
 * {@link Day} component ({@link Month}'s child) is clicked.
 */
/**
 * @description Calendar component.
 *
 * @param {Calendar.Props} props Properties
 * @component
 */
const Calendar = ({
    month,
    year,
    selectRange,
    onDateSelected,
}) => {
    const day = new Date();
    day.setFullYear(year);
    day.setMonth(month);
    // Formatter for calendar view's title
    const serializer = new Intl.DateTimeFormat('default', { month: 'long', year: 'numeric' });

    return (
        <div className={css.calendar}>
            <div className={css.calendarPreamble}>
                {serializer.format(day)}
            </div>
            <Month
                month={month}
                year={year}
                selectRange={selectRange}
                onDateSelected={onDateSelected}
            />
        </div>
    );
};

Calendar.propTypes = {
    year: PropTypes.number.isRequired,
    month: PropTypes.number.isRequired,
    selectRange: PropTypes.bool,
    onDateSelected: PropTypes.func,
};

Calendar.defaultProps = {
    selectRange: false,
    onDateSelected: () => {},
};

export default Calendar;
