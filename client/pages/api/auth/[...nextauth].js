import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import jwt_decode from 'jwt-decode';
import { AuthToken } from '../../../services/auth_token';

async function refreshAccessToken(token) {
    try {
        const response = await fetch(
            process.env.NEXT_PUBLIC_BASE_URL + 'token/refresh',
            {
                method: 'POST',
                body: JSON.stringify({
                    refresh_token: token.refresh_token,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        const refreshedTokens = await response.json();

        if (!response.ok) {
            throw refreshedTokens;
        }

        const decoded = jwt_decode(refreshedTokens.token);

        token.user = [
            (token.id = decoded.id),
            (token.email = decoded.email),
            (token.token = refreshedTokens.token),
            (token.refresh_token = refreshedTokens.refresh_token),
            (token.role = decoded.roles[0]),
        ];

        return {
            ...token,
        };
    } catch (error) {
        console.log(error);

        return {
            ...token,
            error: 'RefreshAccessTokenError',
        };
    }
}

const options = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'email',
                    placeholder: 'jsmith@mail.com',
                },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials, req) {
                const payload = {
                    email: credentials.email,
                    password: credentials.password,
                };

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}login_check`,
                    {
                        method: 'POST',
                        body: JSON.stringify(payload),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (res.status === 401) {
                    const user = await res.json();
                    if (!res.ok) {
                        throw new Error(user.message);
                    }
                }

                if (res) {
                    return res;
                }

                return null;
            },
        }),
    ],
    session: {
        jwt: true,
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                const t = await user.json();
                const decoded = jwt_decode(t.token);

                token.jwt = user.jwt;
                token.user = [
                    (token.id = decoded.id),
                    (token.email = decoded.email),
                    (token.token = t.token),
                    (token.refresh_token = t.refresh_token),
                    (token.role = decoded.roles[0]),
                ];
            }
            const authToken = new AuthToken(token.token);
            if (authToken.isExpired) {
                return refreshAccessToken(token);
            }

            return Promise.resolve(token);
        },

        async session({ session, token }) {
            session.user = {
                id: token.id,
                email: token.email,
                access_token: token.token,
                refresh_token: token.refresh_token,
                role: token.role,
            };
            return Promise.resolve(session);
        },
    },
    pages: {
        signIn: '/sign-in',
    },
    secret: process.env.NEXT_PUBLIC_BASE_URL,
};

export default (req, res) => NextAuth(req, res, options);
