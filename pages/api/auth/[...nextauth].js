import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials';
import jwt_decode from 'jwt-decode';

const options = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {label: "Email", type: "email", placeholder: "jsmith@mail.com"},
                password: {label: "Password", type: "password"}
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

                if (res) {
                    return res;
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
        async jwt({token, user}) {
            if (user) {
                const t = await user.json()
                const decoded = jwt_decode(t.token)

                token.jwt = user.jwt;
                token.user = [
                    token.id = decoded.id,
                    token.email = decoded.email,
                    token.token = t.token,
                    token.refresh_token = t.refresh_token,
                    token.role = decoded.roles[0]
                ]
            }
            return Promise.resolve(token);
        },

        async session({session, token}) {
            session.user = {
                id: token.id,
                email: token.email,
                access_token: token.token,
                refresh_token: token.refresh_token,
                role: token.role,
            }
            return Promise.resolve(session);
        },
    },
    pages: {
        signIn: '/sign-in',
    },
    secret: process.env.SECRET,
}

export default (req, res) => NextAuth(req, res, options)