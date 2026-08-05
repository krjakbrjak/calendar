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

    it('Single selection', () => {
        // Thursday, 1 January 1970
        const timestamp = new Date(0);
        const onDateSelected = sinon.spy();
        let wrapper;

        act(() => {
            wrapper = mount(<Month
                month={timestamp.getMonth()}
                year={timestamp.getFullYear()}
                selectRange={false}
                onDateSelected={onDateSelected}
            />);
        });

        act(() => {
            wrapper.find('.dayContainer .day').at(7).simulate('click');
        });

        // The click itself is the whole selection: it reports once, with no second date
        expect(onDateSelected.callCount).toBe(1);
        expect(onDateSelected.lastCall.args[0].toDateString())
            .toBe(new Date(1970, 0, 4).toDateString());
        expect(onDateSelected.lastCall.args[1]).toBe(null);

        // Hovering must not report a range when a range cannot be selected
        act(() => {
            wrapper.find('.dayContainer').at(20).simulate('mouseenter');
        });

        expect(onDateSelected.callCount).toBe(1);
    });
});
