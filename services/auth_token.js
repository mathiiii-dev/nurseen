import jwtDecode from 'jwt-decode';

export class AuthToken {

    constructor(token) {
        this.decodedToken = { email: "", exp: 0 };
        this.token = token;
        try {
            if(token) {
                this.decodedToken = jwtDecode(this.token);
            }
        } catch (e) {
            console.log('ERROR' + e)
        }
    }
    get authorizationString() {
        return `Bearer ${this.token}`;
    }

    get expiresAt() {
        return new Date(this.decodedToken.exp * 1000);
    }

    get isExpired() {
        return new Date() > this.expiresAt;
    }

    get isValid() {
        return !this.isExpired;
    }
}
