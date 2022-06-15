import Layout from '../components/layout';
import {NotificationsProvider} from '@mantine/notifications';
import {SessionProvider} from 'next-auth/react';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

export default function MyApp({Component, pageProps}) {
    dayjs.locale('fr');
    return (
        <SessionProvider session={pageProps.session}>
            <NotificationsProvider position="top-right">
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </NotificationsProvider>
        </SessionProvider>
    );
}
