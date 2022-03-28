import { useSession, getSession } from "next-auth/react"
import { Box, Button, Group, Modal, Space, Text} from "@mantine/core";
import {useState} from "react";
import {useNotifications} from "@mantine/notifications";

export default function Page({auth}) {
    console.log(useSession())
    const {data: session} = useSession()
    const [opened, setOpened] = useState(false);
    const [link, setLink] = useState('');
    const notifications = useNotifications();

    const linkParent = () => {
        const code = Math.floor(1000 + Math.random() * 9000);
        const today = new Date()
        let tomorrow = new Date()
        tomorrow.setDate(today.getDate() + 1)
        const expiration = tomorrow
        fetch(
            `http://localhost:8010/proxy/api/link_code/`,
            {
                method: 'POST',
                body: JSON.stringify({
                    code,
                    expiration
                }),
                headers: {
                    'Content-type': 'application/json',
                }
            }
        )
            .then(response => response.json())
            .then(response => {
                setLink(code)
            })
    }

    const copyToClipboard = () => {
        notifications.showNotification({
            title: 'Code copiez !',
            message: 'Donner le code au parent pour qu\'il puisse inscrire son enfant',
        })
        navigator.clipboard.writeText(link)
    }
    if (typeof window === "undefined") return null

    if (session) {
        return (
            <>
                <h1>Protected Page</h1>
                <p>You can view this page because you are signed in.</p>
                <Modal
                    opened={opened}
                    onClose={() => setOpened(false)}
                    title="Création d'un code parent nécessaire à l'ajout d'un enfant"
                >
                    <Box sx={(theme) => ({
                        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                        textAlign: 'center',
                        padding: theme.spacing.xl,
                        borderRadius: theme.radius.md,
                        cursor: 'pointer',

                        '&:hover': {
                            backgroundColor:
                                theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
                        },
                    })}
                         onClick={() => copyToClipboard()}
                    >
                        <Text>{link}</Text>
                    </Box>
                    <Space h={"xl"}/>
                    <Text>Cliquez sur le code pour le copier</Text>
                    <Button style={{backgroundColor: '#4ad4c6', float: 'right'}} onClick={() => linkParent()}>Créer un
                        code</Button>
                </Modal>
                <Group position="center">
                    <Button onClick={() => setOpened(true)}>Liaison parent</Button>
                </Group>
            </>
        )
    }
    return <p>Access Denied</p>
}

export async function getServerSideProps(ctx) {
    const auth = await getSession(ctx);

    if (!auth) {
        return {
            redirect: {
                destination: '/sign-in',
                permanent: false
            },
        }
    }

    return {
        props: {
            ...auth,
        }
    }
}
