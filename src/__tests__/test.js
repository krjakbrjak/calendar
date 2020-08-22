import React from 'react';
import { unmountComponentAtNode, render } from 'react-dom';
import { act } from 'react-dom/test-utils';

import Calendar from '../index';

describe('Calendar', () => {
    let container = null;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        unmountComponentAtNode(container);
        container.remove();
        container = null;
    });

    it('Dummy', () => {
        act(() => {
            render(<Calendar />, container);
        });

        expect(container.textContent).toBe('Calendar');
    });
});
