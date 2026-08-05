import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import Calendar from '../Calendar';

// Thursday, 1 January 1970
const timestamp = new Date(0);

const renderCalendar = ({ selectRange = false, onDateSelected } = {}) => render(<Calendar
    month={timestamp.getMonth()}
    year={timestamp.getFullYear()}
    selectRange={selectRange}
    onDateSelected={onDateSelected}
/>);

describe('Calendar', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it('Title', () => {
        renderCalendar();

        const title = new Intl.DateTimeFormat('default', { month: 'long', year: 'numeric' })
            .format(new Date(1970, 0, 1));

        expect(screen.getByText(title)).toBeInTheDocument();
    });

    it('Grid', () => {
        renderCalendar();

        expect(screen.getAllByRole('button')).toHaveLength(42);
    });

    it('Reports a single date by default', () => {
        const onDateSelected = vi.fn();
        renderCalendar({ onDateSelected });

        fireEvent.click(screen.getAllByRole('button')[7]);

        expect(onDateSelected).toHaveBeenCalledTimes(1);
        expect(onDateSelected.mock.calls[0][0].toDateString())
            .toBe(new Date(1970, 0, 4).toDateString());
        expect(onDateSelected.mock.calls[0][1]).toBe(null);
    });

    it('Title does not depend on the current date', () => {
        // The 31st does not exist in February, so building the title from
        // today's date would roll the month over to March
        vi.useFakeTimers();
        vi.setSystemTime(new Date(2026, 0, 31));

        render(<Calendar month={1} year={1970} />);

        const title = new Intl.DateTimeFormat('default', { month: 'long', year: 'numeric' })
            .format(new Date(1970, 1, 1));

        expect(screen.getByText(title)).toBeInTheDocument();
    });

    it('Forwards selectRange', () => {
        const onDateSelected = vi.fn();
        renderCalendar({ selectRange: true, onDateSelected });

        const days = screen.getAllByRole('button');
        fireEvent.click(days[7]);
        fireEvent.click(days[15]);

        expect(days[10].parentElement).toHaveClass('selection');
        expect(onDateSelected.mock.calls.at(-1)[1].toDateString())
            .toBe(new Date(1970, 0, 12).toDateString());
    });
});
