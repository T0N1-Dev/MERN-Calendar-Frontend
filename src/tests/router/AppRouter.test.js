import { configureStore } from "@reduxjs/toolkit";
import { calendarReducer } from "../../reducers/calendarReducer";
import { uiReducer } from "../../reducers/uiReducer";
import { authReducer } from "../../reducers/authReducer";
import { Provider } from "react-redux";
import { AppRouter } from "../../router/AppRouter";
import { render } from "@testing-library/react";

describe('Testing on <AppRouter />', () => {
    
    let store;
    let testContainer;

    beforeEach(() => {
        store = configureStore({
            reducer: {
                calendar: calendarReducer,
                ui: uiReducer,
                auth: authReducer
            },
            preloadedState: {
                calendar: { 
                    events: [{
                        title: 'Test Event',
                        start: new Date(),
                        end: new Date(),
                        allDay: true,
                        bufferBefore: 0,
                        status: 'busy',
                        color: 'blue',
                        tooltip: 'By Test',
                        user: null,
                        id: '123'
                  }], 
                  activeEvent: null 
                },
                ui: { modalOpen: false, mgError: null },
                auth: { uid: "123", name: "Test User", color: "blue" }
            }
        })

        store.dispatch = jest.fn();

        const {container} = render(
            <Provider store={store}>
                <AppRouter />
            </Provider>
        );

        testContainer = container;
    });
    
    test('should match Snapshot', () => {
        expect(testContainer).toMatchSnapshot();
    });   
    
});