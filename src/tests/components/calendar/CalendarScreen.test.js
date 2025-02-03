import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { CalendarScreen } from "../../../components/calendar/CalendarScreen";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { calendarReducer } from "../../../reducers/calendarReducer";
import { authReducer } from "../../../reducers/authReducer";
import { uiReducer } from "../../../reducers/uiReducer";
import { types } from "../../../types/types";

jest.mock("@mobiscroll/react", () => ({
    Eventcalendar: ({ data }) => (
        <div data-testid="event-calendar-mock">
            {data && data.length > 0 ? (
                data.map((event) => (
                    <div key={event.id} className="mock-event">
                        {event.title}
                    </div>
                ))
            ) : (
                <p>No events</p>
            )}
        </div>
    ),
    setOptions: jest.fn(),
    Button: ({ onClick, children }) => <button onClick={onClick}>{children}</button>,
    Input: () => <input />,
    Popup: () => <div>Mocked Popup</div>,
    Datepicker: () => <div>Mocked Datepicker</div>,
    Switch: () => <div>Mocked Switch</div>,
    Snackbar: () => <div>Mocked Snackbar</div>,
    Textarea: () => <textarea />,
    Dropdown: () => <div>Mocked Dropdown</div>,
    Segmented: () => <div>Mocked Segmented</div>,
    SegmentedGroup: () => <div>Mocked SegmentedGroup</div>,
}));  

describe('Testing on <CalendarScreen />', () => {
    
    let store;
    let testContainer;

    beforeEach(() => {
        HTMLCanvasElement.prototype.getContext = jest.fn();
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
                <CalendarScreen />
            </Provider>
        );

        testContainer = container;
    });
    
    test('should match Snapshot', () => {
        expect(testContainer).toMatchSnapshot();
    });   
    
    test("should show event after loading", async () => {
        const eventElement = await screen.findByTestId('event-calendar-mock');
        console.log(eventElement);
    });
    
});