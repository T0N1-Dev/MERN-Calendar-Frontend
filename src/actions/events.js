import Swal from "sweetalert2";
import { fetchWithToken } from "../helpers/fetch";
import { types } from "../types/types";
import { setError } from "./ui";

export const eventStartAddNewEvent = ( event ) => {
    return async ( dispatch ) => {
        const eventToShow = {
            ...event,
            start: new Date(event.start).toLocaleString(),
            end: new Date(event.end).toLocaleString()
        };
        
        try {
            const resp = await fetchWithToken('events', event, 'POST');
            const body = await resp.json();

            if ( body.ok ) {
                eventToShow.id = body.event.id;
                dispatch( eventAddNew( eventToShow ) );
                dispatch( eventStartSetActive( eventToShow ) );
            } else {
                dispatch( setError(body.msg) );
                dispatch( eventStartLoading() );
                Swal.fire('Error', body.msg, 'error');
            }
        } catch (err) {
            console.log(err);
        }
    }
}

const eventAddNew = (event) => ({
    type: types.eventAddNew,
    payload: event
});

export const eventStartSetActive = (event) => {
    return (dispatch) => {
        const activeEvent = {
            ...event,
            start: new Date(event.start).toLocaleString(),
            end: new Date(event.end).toLocaleString(), 
        }
        dispatch( setError(null));
        dispatch(eventSetActive(activeEvent));
    }
};

const eventSetActive = (event) => ({
    type: types.eventSetActive,
    payload: event
});

export const eventStartUpdate = (event) => {
    return async (dispatch) => {
        try {
            const resp = await fetchWithToken(`events/${event.id}`, event, 'PUT');
            const body = await resp.json();
            if (body.ok) {
                dispatch(eventUpdated({ ...event }));
                dispatch(eventStartLoading());
            } else {
                dispatch(setError(body.msg));
                Swal.fire('Error', body.msg, 'error');
            }
        } catch (err) {
            console.error(err);
        }
    };
};


const eventUpdated = (event) => ({
    type: types.eventUpdate,
    payload: event
});

export const eventStartDelete = () => {
    return async ( dispatch, getState ) => {

        const { id } = getState().calendar.activeEvent;

        try {
            const resp = await fetchWithToken(`events/${ id }`, {}, 'DELETE');
            const body = await resp.json();
            if ( body.ok ) {
                dispatch(eventDeleted());
            } else  {
                dispatch(setError(body.msg));
                Swal.fire('Error', body.msg, 'error');
            }
        } catch (err) {
            console.log(err);
        }
    }
}

const eventDeleted = (event) => ({
    type: types.eventDelete
});

export const eventStartLoading = () => {
    return async (dispatch) => {
        try {
            const resp = await fetchWithToken('events');
            const body = await resp.json();
            const events = body.eventos.map(event => ({
                ...event,
                start: new Date(event.start).toLocaleString(),
                end: new Date(event.end).toLocaleString(),
            }));
            dispatch( eventLoaded( events ) );
        } catch (err) {
            console.log(err)
        }
    }
}
export const eventLoaded = (events) => ({
    type: types.eventLoaded,
    payload: events
});