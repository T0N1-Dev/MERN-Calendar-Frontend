import Swal from "sweetalert2";
import { fetchWithToken } from "../helpers/fetch";
import { types } from "../types/types";
import { setError } from "./ui";

export const eventStartAddNewEvent = ( event ) => {
    return async ( dispatch ) => {
        
        try {
            const resp = await fetchWithToken('events', event, 'POST');
            const body = await resp.json();

            if ( body.ok ) {
                event.id = body.event.id;
                dispatch( eventAddNew( event ) );
                dispatch( eventStartSetActive( event ) );
            } else {
                dispatch( setError(body.msg) );
                Swal.fire('Error', body.msg, 'error');
            }
            dispatch( eventStartLoading() );
        } catch (err) {
            console.error(err);
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
                dispatch(eventUpdated(event));
            } else {
                dispatch(setError(body.msg));
                dispatch(eventStartLoading());
                Swal.fire('Error', body.msg, 'error');
            }
        } catch (err) {
            console.error(err);
        }
    };
};


const eventUpdated = (event) => {
    return {
    type: types.eventUpdate,
    payload: event
}};

export const eventStartDelete = (id) => {
    return async ( dispatch ) => {

        try {
            const resp = await fetchWithToken(`events/${ id }`, {}, 'DELETE');
            const body = await resp.json();
            if ( body.ok ) {
                dispatch(eventDeleted());
            } else  {
                dispatch(setError(body.msg));
                Swal.fire('Error', body.msg, 'error');
                dispatch(eventStartLoading());
            }
        } catch (err) {
            console.error(err);
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
            const events = body.eventos;
            dispatch( eventLoaded( events ) );
        } catch (err) {
            console.error(err)
        }
    }
}
export const eventLoaded = (events) => ({
    type: types.eventLoaded,
    payload: events
});