import { Button, Card, Group, Text } from '@mantine/core';
import Link from 'next/link';

export default function DashboardCard({ title, text, buttonText, linkHref }) {
    return (
        <Card shadow="md" p="lg">
            <Group position="apart" style={{ marginBottom: 5 }}>
                <Text weight={500}>{title} </Text>
            </Group>
            <Text size="sm" style={{ lineHeight: 1.5 }}>
                {text}
            </Text>
            <Link href={linkHref}>
                <Button
                    variant="light"
                    color="blue"
                    fullWidth
                    style={{ marginTop: 14 }}
                >
                    {buttonText}
                </Button>
            </Link>
        </Card>
    );
}
