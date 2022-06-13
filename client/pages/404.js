import { Button, Grid, Image, Text, Title } from '@mantine/core';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Custom404() {
    const { data: session } = useSession();
    let dashboard = '';

    if (session) {
        const role = session.user.role;
        dashboard = 'dashboard/nurse';
        if (role === 'ROLE_PARENT') {
            dashboard = 'dashboard/family';
        }
    }
    return (
        <Grid
            style={{
                backgroundColor: '#f4fdfc',
                borderRadius: '11px',
                paddingLeft: '98px',
                paddingRight: '20px',
                paddingTop: '20px',
                paddingBottom: '20px',
            }}
        >
            <Grid.Col md={6}>
                <Title
                    style={{
                        fontSize: '144px',
                    }}
                    order={1}
                >
                    404
                </Title>

                <Text size={'xl'}>Page non trouvée</Text>

                <Text style={{ marginTop: '20px' }}>
                    La page que vous recherché n'existe pas ou n'existe plus
                </Text>
                <Link href={'/' + dashboard}>
                    <Button
                        type="submit"
                        size={'lg'}
                        style={{
                            backgroundColor: '#4ad4c6',
                            marginTop: '98px',
                        }}
                    >
                        Retour à votre dashboard
                    </Button>
                </Link>
            </Grid.Col>
            <Grid.Col md={6}>
                <Image
                    radius="md"
                    src="/img/undraw_page_not_found_re_e9o6.svg"
                    alt="404 image"
                />
            </Grid.Col>
        </Grid>
    );
}
