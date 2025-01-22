import { types } from '../types/types';

// {
//     id: 2,
//     start: moment().add(5, 'days').format('YYYY-MM-DDTHH:mm'),
//     end: moment().add(5, 'days').format('YYYY-MM-DDTHH:mm'),
//     title: 'Conference',
//     description: '',
//     allDay: false,
//     bufferBefore: 30,
//     free: false,
//     color: '#ff9900',
//     user: null
//   },


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

        default:
            return state;
    }
};