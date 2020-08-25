import React from 'react';
import PropTypes from 'prop-types';

import Day from './Day';
import { getWeekdays } from './helpers';

import css from './Month.css';

const DAYS_IN_WEEK = 7;
const NUMBER_OF_WEEKS = 6;

/**
 * @callback Month.onDateSelected
 * @param {Date} date A date.
 * @returns void
 */

/**
 * @description Props for {@link Month} component.
 *
 * @typedef {Object} Month.Props
 * @property {Integer} [year=Current year] An year
 * @property {Integer} [month=Current month] A month offset from the start of the year.
 * @property {Month.onDateSelected} [onDateSelected=null] A callback that is executed when
 * {@link Day} component ({@link Month}'s child) is clicked.
 */
/**
 * @description Month component.
 *
 * A very simple component displaying days of the month
 * (and days of prev/next month if needed) in a grid. The
 * grid is defined in CSS (display: grid).
 * @param {Month.Props} props Properties
 * @component
 */
const Month = ({ month, year, onDateSelected }) => {
    const day = new Date();
    day.setFullYear(year);
    day.setMonth(month);
    day.setDate(1);

    // Generates a grid for the month
    const generateGrid = () => {
        const res = [];
        // The offset for the grid: if the first day of the month is
        // Sunday (day.getDay() === 0) then the offset is 1. Otherwise,
        // it has to be the last Sunday before the first day of the
        // month.
        const offset = 1 - day.getDay();
        for (let i = 0; i < DAYS_IN_WEEK * NUMBER_OF_WEEKS; i += 1) {
            res.push(i + offset);
        }
        return res;
    };

    return (
        <div className={css.month}>
            <div className={css.monthGrid}>
                {getWeekdays().map((el) => <div key={el}>{el}</div>)}
                {generateGrid().map((el) => (
                    <Day
                        onSelected={onDateSelected}
                        key={el}
                        year={year}
                        month={month}
                        date={el}
                    />
                ))}
            </div>
        </div>
    );
};

Month.propTypes = {
    year: PropTypes.number.isRequired,
    month: PropTypes.number.isRequired,
    onDateSelected: PropTypes.func,
};

Month.defaultProps = {
    onDateSelected: () => {},
};

export default Month;
