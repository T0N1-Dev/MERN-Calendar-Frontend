import { fetchWithoutToken, fetchWithToken } from "../../helpers/fetch";

describe('Testing on the helper Fetch', () => {

    let token = '';

    test('fetchWithoutToken should work properly', async () => {

        const resp = await fetchWithoutToken('auth', { email: 'antonio@gmail.com', password: '123456' }, 'POST');

        expect( resp instanceof Response ).toBe( true );

        const body = await resp.json();

        expect( body.ok ).toBe( true );

        token = body.token;
    });

     test('fetchWithToken should work properly', async () => { 
        localStorage.setItem('token', token);

        const resp = await fetchWithToken('events/60f4b1b3b3b3b30015f3b3b3', {}, 'DELETE');
        const body = await resp.json();

        expect( body.msg ).toBe('There is no event with that id.');
    })
});