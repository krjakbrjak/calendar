import { useState } from 'react';
import { createRoot } from 'react-dom/client';

import { Calendar } from '@krjakbrjak/calendar';

const App = () => {
    const [date, setDate] = useState(new Date());

    const style = {
        backgroundColor: 'transparent',
        border: 'none',
    };

    const shiftMonth = (offset: number) => {
        const tmp = new Date(date);
        tmp.setMonth(tmp.getMonth() + offset);
        setDate(tmp);
    };

    return (
        <div style={{ display: 'flex' }}>
            <button onClick={() => shiftMonth(-1)} style={style} type="button">
                &lt;
            </button>
            <Calendar
                month={date.getMonth()}
                year={date.getFullYear()}
                selectRange
                onDateSelected={(first: Date, second: Date | null) => {
                    // eslint-disable-next-line no-console
                    console.log(first, second);
                }}
            />
            <button onClick={() => shiftMonth(1)} style={style} type="button">
                &gt;
            </button>
        </div>
    );
};

const container = document.getElementById('root');
if (!container) {
    throw new Error('#root not found');
}

createRoot(container).render(<App />);
