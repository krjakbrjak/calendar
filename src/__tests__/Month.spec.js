import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount, shallow } from 'enzyme';

import sinon from 'sinon';

import Month from '../Month';
import Day from '../Day';

describe('Month', () => {

    beforeEach(() => {
    });

    afterEach(() => {
    });

    it('Props', () => {
        // Thursday, 1 January 1970
        const timestamp = new Date(0);
        let wrapper;

        act(() => {
            wrapper = mount(<Month
                month={timestamp.getMonth()}
                year={timestamp.getFullYear()}
            />);
        });

        expect(wrapper.props().year).toBe(timestamp.getFullYear());
    });

    it('Components', () => {
        // Thursday, 1 January 1970
        const timestamp = new Date(0);
        let wrapper;

        act(() => {
            wrapper = shallow(<Month
                month={timestamp.getMonth()}
                year={timestamp.getFullYear()}
            />);
        });

        expect(wrapper.find(Day).length).toBe(42);
        expect(wrapper.find(Day).at(5).props().date).toBe(2);
    });
});
