import { setError, uiCloseModal, uiOpenModal } from "../../actions/ui";
import { uiReducer } from "../../reducers/uiReducer";

const initialState = {
    modalOpen: false,
}

describe('Testing on uiReducer', () => {

    test('should return the initialState', () => {
        const state = uiReducer(initialState, {});
        expect(state).toEqual(initialState);
    });

    test('should open and close a modal properly', () => {
        
        const modalOpen = uiOpenModal();
        const state = uiReducer(initialState, modalOpen);

        expect(state).toEqual({ modalOpen: true });

        const modalClose = uiCloseModal();
        const stateClose = uiReducer(state, modalClose);

        expect( stateClose ).toEqual({ modalOpen: false });
    });

    test('should dispatch the error', () => {
        
        const error = setError('Error');
        const state = uiReducer(initialState, error);

        expect( state ).toEqual({ modalOpen: false, mgError: 'Error' });
    });
});