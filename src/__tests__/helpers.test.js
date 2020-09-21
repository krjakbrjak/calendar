import {
    getToday,
    isToday,
    DateRange,
    getWeekdays,
    areDatesEqual,
} from '../helpers';

describe('Helpers', () => {
    it('getToday', () => {
        const today = new Date();

        expect(today.getFullYear()).toBe(getToday().year);
        expect(today.getMonth()).toBe(getToday().month);
        expect(today.getDate()).toBe(getToday().date);
    });

    it('isToday', () => {
        expect(isToday(new Date())).toBe(true);
        expect(isToday(new Date(0))).toBe(false);
    });

    it('DateRange', () => {
        const formatter = new Intl.DateTimeFormat('default', { day: 'numeric', year: 'numeric', month: 'numeric' });

        expect(Array.from(new DateRange(new Date(1970, 1, 1), 1, 0)).length).toBe(0);

        const reference = [
            new Date(1970, 1, 2),
            new Date(1970, 1, 3),
            new Date(1970, 1, 4),
        ];
        const days = Array.from(new DateRange(new Date(1970, 1, 1), 1, 3));

        expect(days.length).toBe(3);

        for (let i = 0; i < 3; i += 1) {
            expect(formatter.format(days[i])).toBe(formatter.format(reference[i]));
        }
    });

    it('getWeekdays', () => {
        const weekdays = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
        ];

        expect(getWeekdays({short: false})).toEqual(weekdays);
    });

    it('areDatesEqual', () => {
        const today = new Date();
        expect(areDatesEqual(today, new Date())).toBe(true);
        expect(areDatesEqual(today, new Date(1988))).toBe(false);
    })
});
