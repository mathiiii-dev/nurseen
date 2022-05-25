import { Button, Grid, Image, Text, Title } from '@mantine/core';
import Link from 'next/link';

export default function NonKidsMessage({ message }) {
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
                <Text style={{ marginTop: '20px' }}>{message}</Text>
                <Link href={'create-kid'}>
                    <Button
                        type="submit"
                        size={'lg'}
                        style={{
                            backgroundColor: '#4ad4c6',
                            marginTop: '98px',
                        }}
                    >
                        Ajoutez un enfant
                    </Button>
                </Link>
            </Grid.Col>
            <Grid.Col md={6}>
                <Image
                    radius="md"
                    src="/img/undraw_void_-3-ggu.svg"
                    alt="Void image"
                />
            </Grid.Col>
        </Grid>
    );
}
