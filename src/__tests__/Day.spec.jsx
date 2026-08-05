import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Day from '../Day';

describe('Day', () => {
    it('Props', () => {
        // Thursday, 1 January 1970
        const timestamp = new Date(0);

        const { rerender } = render(<Day
            date={timestamp.getDate()}
            month={timestamp.getMonth()}
            year={timestamp.getFullYear()}
        />);

        expect(screen.getByRole('button')).toHaveTextContent(String(timestamp.getDate()));
        expect(screen.getByRole('button')).toHaveClass('weekday');

        // Set the 38th day of the month, i.e. January 38th === February 7th,
        // which is a Saturday
        rerender(<Day
            date={38}
            month={timestamp.getMonth()}
            year={timestamp.getFullYear()}
        />);

        expect(screen.getByRole('button')).toHaveClass('weekend');
        expect(screen.getByRole('button')).not.toHaveClass('weekday');
    });

    it('Click event', async () => {
        const user = userEvent.setup();
        const onSelected = vi.fn();

        // year/month/date fall back to today
        render(<Day onSelected={onSelected} />);

        const day = screen.getByRole('button');
        await user.click(day);
        await user.click(day);
        await user.click(day);

        expect(onSelected).toHaveBeenCalledTimes(3);
    });
});
