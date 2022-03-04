import nookies from 'nookies';
import React, { Component } from "react";
import { AuthToken } from "../services/auth_token";

export function privateRoute(WrappedComponent) {
    return class extends Component {
        static async getInitialProps(ctx) {
            const token = nookies.get(ctx)['token'];
            let auth = new AuthToken(token);
            const refresh = nookies.get(ctx)['refresh'];
            console.log(auth.isValid, auth.isExpired)

            if (auth.isExpired) {
                ctx.res.writeHead(302, {
                    Location: "/sign-in?redirected=true",
                });
                ctx.res.end();
                return;
            }

            if(auth.isExpired && refresh) {
                let refreshedToken = null;
                await fetch(
                    'http://localhost:8010/proxy/api/token/refresh',
                    {
                        method: 'POST',
                        body: JSON.stringify({
                            refresh_token: refresh
                        }),
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                    .then(response => response.json())
                    .then(response => {
                        refreshedToken = response.token
                    })
                auth = new AuthToken(refreshedToken);
            }
            const initialProps = { auth };

            let role = 'nurse'//auth.decodedToken.roles[0]
            if(role === 'parent') {
                role = 'family';
            }

            if(ctx.query.id.toString() !== auth.decodedToken.id.toString() || ctx.pathname.split('/')[2] !== role && auth.isValid) {
                ctx.res.writeHead(302, {
                    Location: `/dashboard/${role}/${auth.decodedToken.id}`,
                });
                ctx.res.end();
                return;
            }

            if (WrappedComponent.getInitialProps) {
                const wrappedProps = await WrappedComponent.getInitialProps(initialProps);
                return { ...wrappedProps, auth };
            }
            return initialProps;
        }

        constructor(props) {
            super(props);

            this.state = {
                auth: new AuthToken(this.props.auth.token)
            };
        }

        componentDidMount() {
            this.setState({ auth: new AuthToken(this.props.auth.token) })
        }

        render() {
            const { auth, ...propsWithoutAuth } = this.props;
            return <WrappedComponent auth={this.state.auth} {...propsWithoutAuth} />;
        }
    };
}