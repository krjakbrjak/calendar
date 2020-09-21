/**
 * @namespace helpers
 */
/**
 * @description Date object
 * @typedef {Object} helpers.date
 * @property {Integer} year Year.
 * @property {Integer} month Month offsite of the year [0-11].
 * @property {Integer} date Day offset of the month.
 */
/**
 * Returns today's date.
 *
 * @function helpers.getToday
 * @return {helpers.date} true if a date is today, false otherwise.
 */
const getToday = () => {
    const today = new Date();
    return {
        year: today.getFullYear(),
        month: today.getMonth(),
        date: today.getDate(),
    };
};

/**
 * Tests if a date is today.
 *
 * @function helpers.isToday
 * @param {Date} date A date.
 * @return {boolean} true if a date is today, false otherwise.
 */
const isToday = (date) => {
    const today = new Date();
    return (date.getFullYear() === today.getFullYear()
        && date.getMonth() === today.getMonth()
        && date.getDate() === today.getDate()
    );
};

class DateRange {
    /**
     * Represents a date range.
     * @constructor
     * @memberof helpers
     * @param {Date} date A date.
     * @param {Integer} first An offset from date.
     * @param {Integer} count Number of days in a range.
     */
    constructor(date, first, count) {
        this.date = new Date(date);
        this.date.setDate(date.getDate() + first);
        this.count = count;
    }

    * [Symbol.iterator]() {
        for (let i = 0; i < this.count; i += 1) {
            const tmp = new Date(this.date);
            tmp.setDate(tmp.getDate() + i);
            yield tmp;
        }
    }
}

/**
 * @typedef {Object} WeekdaysRequest
 * @property {string} [encoding='default'] Encoding, i.e. 'en-us', etc.
 * @property {boolean} [short=true] Format.
 * @memberof helpers
 */
/**
 * Returns names of the weekdays.
 *
 * @function getWeekdays
 * @param {WeekdaysRequest} [request={}] Request
 * @returns {Array.<string>}
 * @memberof helpers
 */
const getWeekdays = ({ encoding = 'default', short = true } = {}) => {
    const days = Array.from(new DateRange(new Date(0), 3, 7));
    const formatter = new Intl.DateTimeFormat(encoding, { weekday: short ? 'short' : 'long' });
    return days.map((el) => formatter.format(el));
};

/**
 * Checks whether dates are same.
 *
 * @function areDatesEqual
 * @param {Date} lhs A date
 * @param {Date} rhs A date
 * @returns {Boolean}
 * @memberof helpers
 */
const areDatesEqual = (lhs, rhs) => (
    lhs.getFullYear() === rhs.getFullYear()
    && lhs.getMonth() === rhs.getMonth()
    && lhs.getDate() === rhs.getDate()
);

export {
    getToday,
    isToday,
    DateRange,
    getWeekdays,
    areDatesEqual,
};
