import Swal from 'sweetalert2';
import { authReducer } from '../../reducers/authReducer';
import { uiReducer } from '../../reducers/uiReducer';
import { calendarReducer } from '../../reducers/calendarReducer';
import { startChecking, startLogin, startLogout, startRegister } from '../../actions/auth';
import { configureStore } from '@reduxjs/toolkit';
import * as fetchModule from "../../helpers/fetch";

jest.mock('sweetalert2', () => ({
    fire: jest.fn()
}));

Storage.prototype.setItem = jest.fn();
Storage.prototype.clear = jest.fn();

jest.setTimeout(10000);

describe('Testing on actions Auth', () => {

    let store;
    const email = 'antonio@gmail.com';
    const password = '123456';

    beforeEach(() => {
        store = configureStore({
            reducer: {
                auth: authReducer,
                calendar: calendarReducer,
                ui: uiReducer
            },
            preloadedState: {
                auth: { checking: true },
                calendar: { events: [], activeEvent: null },
                ui: { modalOpen: false }
            }
        }); 

        jest.clearAllMocks();
    });

    test('testing the operation of the startLogin action', async () => {

        await store.dispatch(startLogin(email, password));

        expect(store.getState().auth.uid).toBeTruthy();
        expect(store.getState().auth.name).toBeTruthy();
        expect(store.getState().auth.color).toBeTruthy();
        expect(store.getState().auth.checking).toBeFalsy();
        expect(localStorage.setItem).toHaveBeenCalledWith('token', expect.any(String));
        expect(localStorage.setItem).toHaveBeenCalledWith('token-init-date', expect.any(Number));
    });

    test('testing the errors of the starLogin action', async () => { 

        await store.dispatch(startLogin(email, ''));
        
        expect(store.getState().auth.uid).toBeFalsy();
        expect(store.getState().auth.name).toBeFalsy();
        expect(store.getState().auth.color).toBeFalsy();
        expect(store.getState().auth.checking).toBeTruthy();
        expect(localStorage.setItem).not.toHaveBeenCalled();
        expect(Swal.fire).toHaveBeenCalledWith('Error', 'Password is required', 'error');
        
        await store.dispatch(startLogin(email, '12345'));
        expect(Swal.fire).toHaveBeenLastCalledWith('Error', 'The password must be at least 6 long', 'error');

        await store.dispatch(startLogin(email, '123457'));
        expect(Swal.fire).toHaveBeenLastCalledWith('Error', 'Credentials Error!', 'error');
        
        await store.dispatch(startLogin('', password));
        expect(Swal.fire).toHaveBeenLastCalledWith('Error', 'Email is required', 'error');
        
        await store.dispatch(startLogin('test@gmail.com', '123457'));
        expect(Swal.fire).toHaveBeenLastCalledWith('Error', 'Credentials Error!', 'error');
    });

    test('testing the operation of the startRegister action', async () => {

        fetchModule.fetchWithoutToken = jest.fn(() => ({
            json() {
                return {
                    ok: true,
                    uid: '123',
                    name: 'test',
                    color: '#123456',
                    token: 'ABC123'
                }
            }
        }));

        await store.dispatch( startRegister('test@gmail.com', '123456', 'test'));

        expect(store.getState().auth.uid).toBe('123');
        expect(store.getState().auth.name).toBe('test');
        expect(store.getState().auth.color).toBe('#123456');
        expect(store.getState().calendar.events).toBeTruthy();
        expect(localStorage.setItem).toHaveBeenCalledWith('token', 'ABC123');
        expect(localStorage.setItem).toHaveBeenCalledWith('token-init-date', expect.any(Number));
    });

    test('testing the operation of the startChecking action ', async () => {
        
        fetchModule.fetchWithToken = jest.fn(() => ({
            json() {
                return {
                    ok: true,
                    uid: '123',
                    name: 'test',
                    color: '#123456',
                    token: 'ABC123'
                }
            }
        }));

        await store.dispatch(startChecking());

        expect(store.getState().auth.uid).toBe('123');
        expect(store.getState().auth.name).toBe('test');
        expect(store.getState().auth.color).toBe('#123456');
        expect(store.getState().calendar.events).toBeTruthy();
        expect(localStorage.setItem).toHaveBeenCalledWith('token', 'ABC123');
        expect(localStorage.setItem).toHaveBeenCalledWith('token-init-date', expect.any(Number));

    });

    test('testing the operation of the startLogout action', async () => {
        
        await store.dispatch(startLogout());

        expect(store.getState().auth.uid).toBeFalsy();
        expect(store.getState().auth.name).toBeFalsy();
        expect(store.getState().auth.color).toBeFalsy();
        expect(store.getState().calendar.events).toEqual([]);
        expect(store.getState().calendar.activeEvent).toBe(null);
        expect(localStorage.clear).toHaveBeenCalled();
    });

});