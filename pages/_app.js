import Layout from '../components/layout'
import { NotificationsProvider } from '@mantine/notifications';
import { SessionProvider } from 'next-auth/react'

export default function MyApp({ Component, pageProps }) {
    return (
        <SessionProvider session={pageProps.session}>
            <NotificationsProvider position="top-right">
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </NotificationsProvider>
        </SessionProvider>
    )
}
