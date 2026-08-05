export interface CalendarDate {
    year: number;
    /** Month offset from the start of the year, 0-11. */
    month: number;
    /** Day offset from the start of the month. */
    date: number;
}

export interface WeekdaysRequest {
    /** Locale, e.g. 'en-us'. */
    encoding?: string;
    short?: boolean;
}

/** Returns today's date. */
export const getToday = (): CalendarDate => {
    const today = new Date();
    return {
        year: today.getFullYear(),
        month: today.getMonth(),
        date: today.getDate(),
    };
};

/** Tests if a date is today. */
export const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
    );
};

/** A range of consecutive days, starting `first` days from `date`. */
export class DateRange {
    private readonly date: Date;

    private readonly count: number;

    constructor(date: Date, first: number, count: number) {
        this.date = new Date(date);
        this.date.setDate(date.getDate() + first);
        this.count = count;
    }

    *[Symbol.iterator](): Generator<Date> {
        for (let i = 0; i < this.count; i += 1) {
            const tmp = new Date(this.date);
            tmp.setDate(tmp.getDate() + i);
            yield tmp;
        }
    }
}

/** Returns the names of the weekdays, starting on Sunday. */
export const getWeekdays = ({
    encoding = 'default',
    short = true,
}: WeekdaysRequest = {}): string[] => {
    const days = Array.from(new DateRange(new Date(0), 3, 7));
    const formatter = new Intl.DateTimeFormat(encoding, { weekday: short ? 'short' : 'long' });
    return days.map((el) => formatter.format(el));
};

/** Checks whether two dates fall on the same day. */
export const areDatesEqual = (lhs: Date, rhs: Date): boolean =>
    lhs.getFullYear() === rhs.getFullYear() &&
    lhs.getMonth() === rhs.getMonth() &&
    lhs.getDate() === rhs.getDate();
