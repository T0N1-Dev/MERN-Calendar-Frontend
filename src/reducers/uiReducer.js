import { types } from "../types/types";

const initialState = {
    modalOpen: false,
}

export const uiReducer = ( state = initialState, action ) => {

    switch ( action.type ) {
        case types.uiOpenModal:
            return {
                ...state,
                modalOpen: true
            }

        case types.uiCloseModal:
            return {
                ...state,
                modalOpen: false
            }

        case types.uiSetError:
            return {
                ...state,
                mgError: action.payload
            }

        default:
            return state;
    }
}