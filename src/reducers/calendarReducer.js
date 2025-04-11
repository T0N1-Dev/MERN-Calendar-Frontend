import { types } from '../types/types';

const initialState = {
    events: [],
    activeEvent: null
};


export const calendarReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.eventSetActive:
            return {
                ...state,
                activeEvent: action.payload
            };
        case types.eventAddNew:
            return {
                ...state,
                events: [action.payload, ...state.events]
            };

        case types.eventUpdate:
            return {
                ...state,
                events: state.events.map(
                    e => (e.id === action.payload.id) ? { ...action.payload } : e
                )
            };
            

        case types.eventDelete:
            return {
                ...state,
                events: state.events.filter(
                    e => (e.id !== state.activeEvent.id)
                ),
                activeEvent: null
            }

        case types.eventLoaded:
            return {
                ...state,
                events: [...action.payload]
            }
        
        case types.eventCleaning:
            return {
                ...state,
                events: [],
                activeEvent: null
            }

        default:
            return state;
    }
};