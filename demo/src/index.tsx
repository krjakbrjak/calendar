import { useState } from 'react';
import { createRoot } from 'react-dom/client';

import { Calendar } from '@krjakbrjak/calendar';

import './styles.css';

const formatter = new Intl.DateTimeFormat('default', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
});

const App = () => {
    const [date, setDate] = useState(new Date());
    const [range, setRange] = useState<[Date, Date | null] | null>(null);

    const shiftMonth = (offset: number) => {
        setDate(new Date(date.getFullYear(), date.getMonth() + offset, 1));
    };

    const [first, second] = range ?? [];
    const selected = (() => {
        if (!first) {
            return 'none';
        }
        if (!second) {
            return formatter.format(first);
        }
        return `${formatter.format(first)} - ${formatter.format(second)}`;
    })();

    return (
        <main className="app">
            <h1 className="app__title">Calendar</h1>

            <div className="nav">
                <button
                    className="nav__button"
                    onClick={() => shiftMonth(-1)}
                    type="button"
                    aria-label="Previous month"
                >
                    &#8249;
                </button>

                <div className="nav__calendar">
                    <Calendar
                        month={date.getMonth()}
                        year={date.getFullYear()}
                        selectRange
                        onDateSelected={(from: Date, to: Date | null) => setRange([from, to])}
                    />
                </div>

                <button
                    className="nav__button"
                    onClick={() => shiftMonth(1)}
                    type="button"
                    aria-label="Next month"
                >
                    &#8250;
                </button>
            </div>

            <p className="readout">
                <span>Selected</span>
                <b>{selected}</b>
            </p>
        </main>
    );
};

const container = document.getElementById('root');
if (!container) {
    throw new Error('#root not found');
}

createRoot(container).render(<App />);
