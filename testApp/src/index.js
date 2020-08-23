/**
 * Entry point.
 *
 * @author Nikita Vakula <programmistov.programmist@gmail.com>
 */

import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import Calendar from '../../src/Calendar';

const App = () => {
    const [date, setDate] = useState(new Date());

    const style = {
        backgroundColor: 'transparent',
        border: 'none',
    };

    const nextMonth = () => {
        const tmp = new Date(date);
        tmp.setMonth(tmp.getMonth() + 1);
        setDate(tmp);
    };

    const prevMonth = () => {
        const tmp = new Date(date);
        tmp.setMonth(tmp.getMonth() - 1);
        setDate(tmp);
    };

    return (
        <div style={{ display: 'flex' }}>
            <button onClick={prevMonth} style={style} type="button">&lt;</button>
            <Calendar month={date.getMonth()} year={date.getFullYear()} />
            <button onClick={nextMonth} style={style} type="button">&gt;</button>
        </div>
    );
};

ReactDOM.render(
    <App />,
    document.getElementById('root'),
);
