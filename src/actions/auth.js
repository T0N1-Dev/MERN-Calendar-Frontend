import { fetchWithoutToken, fetchWithToken } from "../helpers/fetch";
import { types } from "../types/types";
import Swal from 'sweetalert2'

export const startLogin = ( email, password ) => {
    return async (dispatch) => {
        const resp = await fetchWithoutToken( 'auth', { email, password }, 'POST')
        const body = await resp.json();

        if ( body.ok ) {
            localStorage.setItem('token', body.token);
            localStorage.setItem('token-init-date', new Date().getTime());

            dispatch(login({
                uid: body.uid,
                name: body.name,
                color: body.color
            }));
        } else {
            Swal.fire('Error', body.msg, 'error');
        }
    }
}

export const startRegister = ( email, password, username ) => {
    return async (dispatch) => {
        const resp = await fetchWithoutToken('auth/new', { email, password, username }, 'POST')
        const body = await resp.json();

        if ( body.ok ) {
            localStorage.setItem('token', body.token);
            localStorage.setItem('token-init-date', new Date().getTime());

            dispatch(login({
                uid: body.uid,
                name: body.name,
                color: body.color
            }));
        } else {
            Swal.fire('Error', body.msg, 'error');
        }
    }
}

export const startChecking = () => {
    return async (dispatch) => {
        const resp = await fetchWithToken('auth/renew')
        const body = await resp.json();
        if ( body.ok ) {
            localStorage.setItem('token', body.token);
            localStorage.setItem('token-init-date', new Date().getTime());

            dispatch(login({
                uid: body.uid,
                name: body.name,
                color: body.color
            }));
        } else {
            dispatch( checkingFinish() );
        }
    }
}

const checkingFinish = () => ({ type: types.authCheckingFinish });

const login = ( user ) => ({
    type: types.authLogin,
    payload: user
})

export const startLogout = () => {
    return (dispatch) => {
        localStorage.clear();
        dispatch( logout() );
    }
}

export const logout = () => ({ type: types.authLogout });