import { Button, Card, Grid, Text } from '@mantine/core';
import { CalendarIcon } from 'react-calendar-icon';
import Link from 'next/link';

export default function VerticalCard({ children, text, link, button }) {
    return (
        <Card>
            <Grid>
                <Grid.Col md={4}>{children}</Grid.Col>
                <Grid.Col md={8}>
                    <Text size="sm">{text}</Text>
                </Grid.Col>
            </Grid>
            <Link href={link}>
                <Button
                    variant="light"
                    color="blue"
                    fullWidth
                    style={{ marginTop: 14 }}
                >
                    {button}
                </Button>
            </Link>
        </Card>
    );
}
