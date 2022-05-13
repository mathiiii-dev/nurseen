import { Box, Button, Card, Group, Modal, Space, Text } from '@mantine/core';
import Link from 'next/link';
import { useNotifications } from '@mantine/notifications';
import { useState } from 'react';

export default function DashboardCard({
    title,
    text,
    buttonText,
    linkHref,
    bearer,
    userId,
    modal,
    code,
}) {
    let linkCode = '';
    if (code) {
        linkCode = code;
    }
    const [opened, setOpened] = useState(false);
    const [link, setLink] = useState(linkCode);
    const notifications = useNotifications();
    const linkParent = () => {
        fetch(process.env.BASE_URL + `link_code/${userId}`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: bearer,
            },
        })
            .then((response) => response.json())
            .then((response) => {
                setLink(response.code);
            });
    };

    const copyToClipboard = () => {
        notifications.showNotification({
            title: 'Code copiez !',
            message:
                "Donner le code au parent pour qu'il puisse inscrire son enfant",
        });
        navigator.clipboard.writeText(link);
    };
    if (typeof window === 'undefined') return null;
    return (
        <>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="Création d'un code parent nécessaire à l'ajout d'un enfant"
            >
                {link ? (
                    <>
                        <Box
                            sx={(theme) => ({
                                backgroundColor:
                                    theme.colorScheme === 'dark'
                                        ? theme.colors.dark[6]
                                        : theme.colors.gray[0],
                                textAlign: 'center',
                                padding: theme.spacing.xl,
                                borderRadius: theme.radius.md,
                                cursor: 'pointer',

                                '&:hover': {
                                    backgroundColor:
                                        theme.colorScheme === 'dark'
                                            ? theme.colors.dark[5]
                                            : theme.colors.gray[1],
                                },
                            })}
                            onClick={() => {
                                if (link) {
                                    setOpened(false);
                                    copyToClipboard();
                                    setLink(null);
                                }
                            }}
                        >
                            <Text>{link}</Text>
                        </Box>
                        <Text>Cliquez sur le code pour le copier</Text>
                    </>
                ) : (
                    <Button
                        style={{ backgroundColor: '#4ad4c6', float: 'right' }}
                        onClick={() => {
                            linkParent();
                        }}
                    >
                        Créer un code
                    </Button>
                )}
            </Modal>
            <div style={{ width: 340, margin: 'auto' }}>
                <Card shadow="sm" p="lg">
                    <Group position="apart" style={{ marginBottom: 5 }}>
                        <Text weight={500}>{title} </Text>
                    </Group>

                    <Text size="sm" style={{ lineHeight: 1.5 }}>
                        {text}
                    </Text>
                    {modal ? (
                        <Button
                            onClick={() => setOpened(true)}
                            variant="light"
                            color="blue"
                            fullWidth
                            style={{ marginTop: 14 }}
                        >
                            {buttonText}
                        </Button>
                    ) : (
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
                    )}
                </Card>
            </div>
        </>
    );
}
