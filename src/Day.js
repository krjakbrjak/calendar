import React from 'react';
import { PropTypes } from 'prop-types';

import { getToday, isToday } from './helpers';

import css from './Day.css';

/**
 * @callback Day.onSelected
 * @param {Date} date A date.
 * @returns void
 */

/**
 * @description Props for {@link Day} component.
 *
 * @typedef {Object} Day.Props
 * @property {Integer} [year=Current year] An year
 * @property {Integer} [month=Current month] A month offset from the start of the year.
 * @property {Integer} [date=Current date] A day offset from the start of the year.
 * @property {Day.onSelected} [onSelected=null] A callback that is executed when component
 * is clicked.
 */
/**
 * @description Day component.
 *
 * Simple clickable component that displays current date (numeric format).
 *
 * Different styles are applied to the element depending on whether it is
 * a weekday or a weekend or today. It gets calculated based on the props
 * passed.
 * @param {Day.Props} props Properties
 * @component
 */
const Day = ({
    year, month, date, onSelected,
}) => {
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
        <div
            onClick={() => onSelected(tmp)}
            onKeyDown={null}
            role="button"
            className={className}
            tabIndex={date}
        >
            {tmp.getDate()}
        </div>
    );
};

Day.propTypes = {
    year: PropTypes.number,
    month: PropTypes.number,
    date: PropTypes.number,
    onSelected: PropTypes.func,
};

Day.defaultProps = {
    ...getToday(),
    onSelected: () => {},
};

export default Day;
