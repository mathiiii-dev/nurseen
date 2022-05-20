import CustomNavbar from './customnavbar';
import { Container, MantineProvider } from '@mantine/core';

export default function Layout({ children }) {
    return (
        <>
            <CustomNavbar />
            <MantineProvider
                defaultProps={{
                    Container: {
                        sizes: {
                            xs: 540,
                            sm: 720,
                            md: 960,
                            lg: 1140,
                            xl: 1320,
                        },
                    },
                }}
            >
                <Container size={'xl'}>{children}</Container>
            </MantineProvider>
        </>
    );
}
