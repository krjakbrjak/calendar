import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';

import sinon from 'sinon';

import Day from '../Day';

describe('Day', () => {

    function getDiv(wrapper) {
        if (wrapper) {
            return wrapper.find('.day');
        }

        return null;
    }

    beforeEach(() => {
    });

    afterEach(() => {
    });

    it('Props', () => {
        // Thursday, 1 January 1970
        const timestamp = new Date(0);
        let wrapper;

        act(() => {
            wrapper = mount(<Day
                date={timestamp.getDate()}
                month={timestamp.getMonth()}
                year={timestamp.getFullYear()}
            />);
        });

        expect(wrapper.props().date).toBe(timestamp.getDate());
        expect(getDiv(wrapper).hasClass('weekday')).toBe(true);

        // Set 38th day of the month, i.e. January 38th === September 7rd
        wrapper.setProps({
            date: 38,
        });

        expect(getDiv(wrapper).hasClass('weekend')).toBe(true);
        expect(getDiv(wrapper).hasClass('weekday')).toBe(false);
    });

    it('Click event', () => {
        let wrapper;
        const onSelected = sinon.spy();

        act(() => {
            wrapper = mount(<Day
                onSelected={onSelected}
            />);
        });

        getDiv(wrapper).simulate('click');
        getDiv(wrapper).simulate('click');
        getDiv(wrapper).simulate('click');

        expect(onSelected).toHaveProperty('callCount', 3);
    });
});
