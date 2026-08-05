import { useState, useEffect } from 'react';

import Day from './Day';
import { getWeekdays, areDatesEqual } from './helpers';

import css from './Month.module.css';

const DAYS_IN_WEEK = 7;
const NUMBER_OF_WEEKS = 6;

interface Selection {
    first: Date | null;
    second: Date | null;
    intermediate: Date | null;
}

export interface MonthProps {
    year: number;
    /** Month offset from the start of the year, 0-11. */
    month: number;
    selectRange: boolean;
    onDateSelected?: (first: Date, second: Date | null) => void;
}

/**
 * Displays the days of a month, plus the surrounding days of the adjacent
 * months, in a grid. The grid itself is defined in CSS.
 */
const Month = ({ month, year, selectRange, onDateSelected = () => {} }: MonthProps) => {
    const day = new Date(year, month, 1);

    const [selection, setSelection] = useState<Selection>({
        first: null,
        second: null,
        intermediate: null,
    });

    // Call onDateSelected only if selection has changed. Without selectRange
    // a click is the whole selection, so there is no second date. With it,
    // selection.intermediate holds the end of the range while hovering, until
    // a second date is clicked.
    useEffect(() => {
        if (!onDateSelected || !selection.first) {
            return;
        }

        if (!selectRange) {
            onDateSelected(selection.first, null);
        } else if (selection.second) {
            onDateSelected(selection.first, selection.second);
        } else if (selection.intermediate) {
            onDateSelected(selection.first, selection.intermediate);
        }
    }, [selection]);

    // Generates a grid for the month
    const generateGrid = (): number[] => {
        const res: number[] = [];
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

    // Determines if the value is within the selected range.
    const isSelection = (value: Date): boolean => {
        if (selectRange && selection.first) {
            if (selection.second) {
                return value >= selection.first && value <= selection.second;
            }

            return (
                selection.intermediate !== null &&
                value >= selection.first &&
                value <= selection.intermediate
            );
        }

        return false;
    };

    // Calculates the class for day's div container
    const getClassName = (value: Date): string => {
        let className = 'dayContainer';
        if (isSelection(value)) {
            className = `${className} ${css.selection}`;
        }

        return className;
    };

    return (
        <div className={css.month}>
            <div className={css.monthGrid}>
                {getWeekdays().map((el) => (
                    <div key={el}>{el}</div>
                ))}
                {generateGrid().map((el) => {
                    const d = new Date(year, month, el);
                    return (
                        <div
                            key={el}
                            onMouseEnter={() => {
                                // intermediate is only used to preview a range
                                if (selectRange) {
                                    setSelection({
                                        ...selection,
                                        intermediate: d,
                                    });
                                }
                            }}
                            className={getClassName(d)}
                        >
                            <Day
                                onSelected={(date) => {
                                    if (selectRange === true) {
                                        if (selection.first && selection.second) {
                                            setSelection({
                                                first: date,
                                                second: null,
                                                intermediate: null,
                                            });
                                        } else if (
                                            selection.first &&
                                            !areDatesEqual(selection.first, date)
                                        ) {
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
                                            intermediate: null,
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

export default Month;
