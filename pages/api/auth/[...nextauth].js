import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials';
import jwt_decode from 'jwt-decode';
import {setCookie} from "nookies";

const options = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "jsmith@mail.com" },
                password: {  label: "Password", type: "password" }
            },
            async authorize(credentials, req) {

                const payload = {
                    email: credentials.email,
                    password: credentials.password,
                };

                const res = await fetch('http://localhost:8010/proxy/api/login_check', {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const user = await res.json();

                if (res.ok && user) {
                    return user;
                } else {
                    return null;
                }
            }
        })
    ],
    session: {
        jwt: true
    },
    callbacks: {
        async jwt(token, user, account, profile, isNewUser) {
            if (user?.token) {
                token.token = user.token;
            }
            return token;
        },

        async session(session, token) {
            return session;
        }
    },
    pages: {
        signIn: '/sign-in',
    },
    secret: process.env.SECRET,
}

export default (req, res) => NextAuth(req, res, options)
