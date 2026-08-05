import { render, screen, fireEvent } from '@testing-library/react';

import Month from '../Month';

// Thursday, 1 January 1970
const timestamp = new Date(0);

// fireEvent is used instead of userEvent here: these tests assert exactly which
// events reach the component, and userEvent.click also fires pointer/hover
// events that would themselves drive the range preview.
const renderMonth = ({ selectRange = true, onDateSelected } = {}) => render(<Month
    month={timestamp.getMonth()}
    year={timestamp.getFullYear()}
    selectRange={selectRange}
    onDateSelected={onDateSelected}
/>);

describe('Month', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it('Grid alignment does not depend on the current date', () => {
        // April has no 31st, so deriving the grid from today's date would roll
        // over into May and compute the offset from the wrong weekday
        vi.useFakeTimers();
        vi.setSystemTime(new Date(2026, 2, 31));

        render(<Month month={3} year={1970} selectRange={false} />);

        // 1 April 1970 was a Wednesday, so the grid starts on 29 March
        const cells = screen.getAllByRole('button').slice(0, 5).map((b) => b.textContent);
        expect(cells).toEqual(['29', '30', '31', '1', '2']);
    });

    it('Props', () => {
        renderMonth();

        const days = screen.getAllByRole('button');

        // Six weeks of seven days, always
        expect(days).toHaveLength(42);

        // 1 January 1970 is a Thursday, so the grid starts on the preceding
        // Sunday, 28 December 1969
        expect(days[0]).toHaveTextContent('28');
    });

    it('Components', () => {
        renderMonth();

        expect(screen.getAllByRole('button')[5]).toHaveTextContent('2');
    });

    it('Selection', () => {
        renderMonth();

        const days = screen.getAllByRole('button');
        const first = 7;
        const last = 15;

        // Makes selection
        fireEvent.click(days[first]);
        fireEvent.click(days[last]);

        const selected = days
            .map((day) => day.parentElement)
            .filter((container) => container.classList.contains('selection'));

        // the number of nodes should equal `last - first + 1` because the selection
        // is inclusive
        expect(selected).toHaveLength(last - first + 1);

        for (let i = first; i < last + 1; i += 1) {
            expect(days[i].parentElement).toHaveClass('selection');
        }
    });

    it('Single selection', () => {
        const onDateSelected = vi.fn();
        renderMonth({ selectRange: false, onDateSelected });

        const days = screen.getAllByRole('button');

        fireEvent.click(days[7]);

        // The click itself is the whole selection: it reports once, with no second date
        expect(onDateSelected).toHaveBeenCalledTimes(1);
        expect(onDateSelected.mock.calls[0][0].toDateString())
            .toBe(new Date(1970, 0, 4).toDateString());
        expect(onDateSelected.mock.calls[0][1]).toBe(null);

        // Hovering must not report a range when a range cannot be selected
        fireEvent.mouseEnter(days[20].parentElement);

        expect(onDateSelected).toHaveBeenCalledTimes(1);
    });
});
