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
                selectRange
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
                selectRange
            />);
        });

        expect(wrapper.find(Day).length).toBe(42);
        expect(wrapper.find(Day).at(5).props().date).toBe(2);
    });

    it('Selection', () => {
        // Thursday, 1 January 1970
        const timestamp = new Date(0);
        let wrapper;

        act(() => {
            wrapper = mount(<Month
                month={timestamp.getMonth()}
                year={timestamp.getFullYear()}
                selectRange
            />);
        });

        const first = 7;
        const last = 15;

        // Makes selection
        act(() => {
            wrapper.find('.dayContainer .day').at(first).simulate('click');
        });

        act(() => {
            wrapper.find('.dayContainer .day').at(last).simulate('click');
        });

        // Makes sure that the wrapper has all the latest changes
        wrapper.update();

        // the number of nodes should equal `last - first + 1` because the selection
        // is inclusive
        expect(wrapper.find('.dayContainer.selection')).toHaveLength(last - first + 1);

        const found = wrapper.find('.dayContainer');
        for (let i = first; i < last + 1; i += 1) {
            expect(found.at(i).hasClass('selection')).toBe(true);
        }
    });
});
