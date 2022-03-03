import nookies from 'nookies';
import React, { Component } from "react";
import { AuthToken } from "../services/auth_token";

export function privateRoute(WrappedComponent) {

    return class extends Component {

        static async getInitialProps(ctx) {
            const token = nookies.get(ctx)['token'];
            const auth = new AuthToken(token);
            const initialProps = { auth };
            if (auth.isExpired) {
                ctx.res.writeHead(302, {
                    Location: "/sign-in?redirected=true",
                });
                ctx.res.end();
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