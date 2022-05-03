import {setCookie, destroyCookie} from "nookies";

export function setCookies(name, value) {
    setCookie(null, name, value, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
    })
}

export function destroy(name) {
    destroyCookie(null, 'sbsToken', {
        path: '/',
    })
}