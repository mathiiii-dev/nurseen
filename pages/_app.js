import Layout from '../components/layout'
import { NotificationsProvider } from '@mantine/notifications';

export default function MyApp({ Component, pageProps }) {
    return (
        <NotificationsProvider position="top-right">
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </NotificationsProvider>
    )
}