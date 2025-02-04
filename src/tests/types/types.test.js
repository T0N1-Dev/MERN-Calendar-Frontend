import { types } from "../../types/types";

describe('Testing on types', () => {

    const typesTest = {
        uiOpenModal: '[ui] Open modal',
        uiCloseModal: '[ui] Close modal',
        uiSetError: '[ui] Set error',
    
        eventSetActive: '[event] Set active',
        eventStartAddNew: '[event] Start add new',
        eventAddNew: '[event] Add new',
        eventUpdate: '[event] Event updated',
        eventDelete: '[event] Event deleted',
        eventLoaded: '[event] Events loaded',
        eventCleaning: '[event] Events cleaned',
    
        authCheckingFinish: '[auth] Finish checking login state',
        authStartLogin: '[auth] Start login',
        authLogin: '[auth] Login',
        authStartRegister: '[auth] Start Register',
        authStartTokenRenew: '[auth] Start token renew',
        authLogout: '[auth] Logout',
    }

    test('Types must match', () => { 
        expect(types).toEqual(typesTest);
    });
});