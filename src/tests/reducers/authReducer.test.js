import { authReducer } from "../../reducers/authReducer";
import { types } from "../../types/types";

const initialState = {
    checking: true,
}

describe('Testing on authReducer.js', () => {
    
    test('should return the initialState', () => {
        const state = authReducer(initialState, {});
        expect(state).toEqual(initialState);
    });

    test('should authenticate the user', () => {
        const action = {
            type: types.authLogin,
            payload: {
                uid: 'abc123',
                name: 'Test',
                color: 'blue'
            }
        }
        const state = authReducer(initialState, action);
        expect(state).toEqual({ checking: false, uid: 'abc123', name: 'Test', color: 'blue' });
    });

    test('should set false to checking', () => {
        const action = {
            type: types.authCheckingFinish
        }
        const state = authReducer(initialState, action);
        expect(state).toEqual({ checking: false });
    });

    test('should logout the user', () => {
        const action = {
            type: types.authLogout
        }
        const state = authReducer(initialState, action);
        expect(state).toEqual({ checking: false });
    });
});