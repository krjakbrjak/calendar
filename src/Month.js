import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Day from './Day';
import {
    getWeekdays,
    areDatesEqual,
} from './helpers';

import css from './Month.css';

const DAYS_IN_WEEK = 7;
const NUMBER_OF_WEEKS = 6;

/**
 * @callback Month.onDateSelected
 * @param {Date} first A date.
 * @param {Date} [second=null] A date (if the range is selected).
 * @returns void
 */

/**
 * @description Props for {@link Month} component.
 *
 * @typedef {Object} Month.Props
 * @property {Integer} [year=Current year] An year
 * @property {Integer} [month=Current month] A month offset from the start of the year.
 * @property {Boolean} selectRange An option to select either a single date or a rnage of dates.
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
const Month = ({
    month,
    year,
    selectRange,
    onDateSelected,
}) => {
    const day = new Date();
    day.setFullYear(year);
    day.setMonth(month);
    day.setDate(1);

    const [selection, setSelection] = useState({
        first: null,
        second: null,
        intermediate: null,
    });

    // Call onDateSelected only if selection has changed and
    // if selection.first is selected and either selection.first
    // or selection.intermediate is selected.
    useEffect(() => {
        if (onDateSelected) {
            if (selection.first && selection.second) {
                onDateSelected(selection.first, selection.second);
            } else if (selection.first && selection.intermediate) {
                onDateSelected(selection.first, selection.intermediate);
            }
        }
    }, [selection]);

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

    // Determines if the valus is within the
    // selected range.
    const isSelection = (value) => {
        if (selectRange && selection.first) {
            if (selection.second) {
                return value >= selection.first && value <= selection.second;
            }

            return value >= selection.first && value <= selection.intermediate;
        }

        return false;
    };

    // Calculates the class for day's div container
    const getClassName = (value) => {
        let className = 'dayContainer';
        if (isSelection(value)) {
            className = `${className} ${css.selection}`;
        }

        return className;
    };

    return (
        <div className={css.month}>
            <div className={css.monthGrid}>
                {getWeekdays().map((el) => <div key={el}>{el}</div>)}
                {generateGrid().map((el) => {
                    const d = new Date(year, month, el);
                    return (
                        <div
                            key={d}
                            onMouseEnter={() => setSelection({
                                ...selection,
                                intermediate: d,
                            })}
                            className={getClassName(d)}
                        >
                            <Day
                                onSelected={(date) => {
                                    if (selectRange === true) {
                                        if (selection.first && selection.second) {
                                            setSelection({
                                                first: date,
                                                second: null,
                                            });
                                        } else if (selection.first
                                            && !areDatesEqual(selection.first, date)) {
                                            setSelection({
                                                ...selection,
                                                second: date,
                                            });
                                        } else if (!selection.first) {
                                            setSelection({
                                                ...selection,
                                                first: date,
                                            });
                                        }
                                    } else {
                                        setSelection({
                                            first: date,
                                            second: null,
                                        });
                                    }
                                }}
                                key={el}
                                year={year}
                                month={month}
                                date={el}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

Month.propTypes = {
    year: PropTypes.number.isRequired,
    month: PropTypes.number.isRequired,
    selectRange: PropTypes.bool.isRequired,
    onDateSelected: PropTypes.func,
};

Month.defaultProps = {
    onDateSelected: () => {},
};

export default Month;
