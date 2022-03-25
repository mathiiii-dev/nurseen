import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials';
import jwt_decode from 'jwt-decode';
const options = {
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: "Email", type: "email", placeholder: "jsmith@mail.com" },
                password: {  label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // Add logic here to look up the user from the credentials supplied

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

                const token = await res.json();
                const user = jwt_decode(token.token);

                if (!res.ok) {
                    throw new Error(user.exception);
                }
                // If no error and we have user data, return it
                if (res.ok && user) {
                    return user;
                }

                // Return null if user data could not be retrieved
                return null;
            }
        })
    ],
    session: {
        jwt: true
    },
    jwt: {
        // A secret to use for key generation - you should set this explicitly
        // Defaults to NextAuth.js secret if not explicitly specified.
        secret: 'INp8IvdIyeMcoGAgFGoA61DdBglwwSqnXJZkgz8PSnw',
    }

}

export default (req, res) => NextAuth(req, res, options)
