import { getSession } from 'next-auth/react';
import {
    Alert,
    Box,
    Button,
    Card,
    Grid,
    Modal,
    Space,
    Text,
    Title,
} from '@mantine/core';
import { useState } from 'react';
import { AuthToken } from '../../../services/auth_token';
import Link from 'next/link';
import { useRouter } from 'next/router';
import '../../../styles/globals.css';
import DashboardCard from '../../../components/DashboardCard';
import { CalendarIcon } from 'react-calendar-icon';
import { AiFillFile, AiFillWechat } from 'react-icons/ai';
import { useNotifications } from '@mantine/notifications';

export default function Page({ bearer, kids, userId, code }) {
    const router = useRouter();

    const [archiveOpened, setArchiveOpened] = useState(false);
    const [kidId, setKidId] = useState(false);
    const [opened, setOpened] = useState(false);
    const [link, setLink] = useState(code);
    const notifications = useNotifications();

    const activate = (kidId) => {
        fetch(process.env.BASE_URL + `kid/${kidId}/activate`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: bearer,
            },
        }).then((r) => {
            router.reload();
        });
    };

    const archived = () => {
        fetch(process.env.BASE_URL + `kid/${kidId}/archive`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: bearer,
            },
        }).then((r) => {
            router.reload();
        });
    };

    const cards = {
        feed: {
            title: "Fil d'actualité",
            buttonText: 'Ajouter un post',
            text: 'Montrer aux parents ce que font leurs enfants pendant la journée',
            linkHref: 'nurse/calendar',
        },
        note: {
            title: 'Note journalière',
            buttonText: 'Ajouter une note',
            text: "Ajouter une note sur la journée de l'enfant. Elle sera ensuite visible par ses parents",
            linkHref: 'nurse/note',
        },
        gallery: {
            title: 'Galerie photo',
            buttonText: 'Ajouter des photos',
            text: 'Ajouter des photos des enfants en vrac. Elles serront visibles par les parents',
            linkHref: 'nurse/gallery',
        },
        menu: {
            title: 'Menu du jour',
            buttonText: 'Ajouter un menu',
            text: 'Ajouter un menu du jour. Il sera visible par les parents',
            linkHref: 'nurse/menu',
        },
    };

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
                {code ? (
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
                                setOpened(false);
                                copyToClipboard();
                            }}
                        >
                            <Text>{code}</Text>
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
            <Grid>
                <Grid.Col md={6}>
                    <Title>Bonjour, John Doe ! </Title>
                </Grid.Col>
                <Grid.Col md={3} offset={3}>
                    <Button onClick={() => setOpened(true)}>
                        Code de liaison
                    </Button>
                </Grid.Col>
            </Grid>

            <Space h={'xl'} />
            <Grid>
                {cards &&
                    Object.values(cards).map((card) => {
                        return (
                            <Grid.Col md={3}>
                                <DashboardCard
                                    title={card.title}
                                    buttonText={card.buttonText}
                                    text={card.text}
                                    linkHref={card.linkHref}
                                />
                            </Grid.Col>
                        );
                    })}
            </Grid>

            <Modal
                opened={archiveOpened}
                onClose={() => setArchiveOpened(false)}
                hideCloseButton
                centered
            >
                <Alert title="Attention !" color="red">
                    Êtes-vous sûr de vouloir archiver cette enfant ? <br />
                    Il n'apparaitra plus dans cette liste
                </Alert>
                <Space h={'xl'} />
                <Button fullWidth color="red" onClick={() => archived()}>
                    Archiver
                </Button>
            </Modal>
            <Space h={'xl'} />
            <Space h={'xl'} />
            <Grid gutter="xl">
                <Grid.Col md={8}>
                    <table>
                        <thead>
                            <tr>
                                <th scope="col">
                                    <Text>Nom</Text>
                                </th>
                                <th scope="col">
                                    <Text>Prénom</Text>
                                </th>
                                <th scope="col">
                                    <Text>Activer</Text>
                                </th>
                                <th scope="col">
                                    <Text>Archiver</Text>
                                </th>
                                <th scope="col">
                                    <Text>Note</Text>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {kids &&
                                kids.map((kid) => {
                                    return (
                                        <tr>
                                            <td data-label="Nom">
                                                <Text>{kid.lastname}</Text>
                                            </td>
                                            <td data-label="Prénom">
                                                <Text>{kid.firstname}</Text>
                                            </td>
                                            <td data-label="Activer">
                                                {kid.activated ? (
                                                    <Button
                                                        color="red"
                                                        onClick={() =>
                                                            activate(
                                                                kid.id,
                                                                false
                                                            )
                                                        }
                                                    >
                                                        Désactiver
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        style={{
                                                            backgroundColor:
                                                                '#4ad4c6',
                                                        }}
                                                        onClick={() =>
                                                            activate(
                                                                kid.id,
                                                                true
                                                            )
                                                        }
                                                    >
                                                        Activer
                                                    </Button>
                                                )}
                                            </td>
                                            <td data-label="Archiver">
                                                {
                                                    <Button
                                                        color="red"
                                                        onClick={() => {
                                                            setArchiveOpened(
                                                                true
                                                            );
                                                            setKidId(kid.id);
                                                        }}
                                                    >
                                                        Archiver
                                                    </Button>
                                                }
                                            </td>
                                            <td data-label="Note">
                                                <Link
                                                    href={{
                                                        pathname: `/dashboard/nurse/kid/[pid]/notes`,
                                                        query: { pid: kid.id },
                                                    }}
                                                >
                                                    <Button>Note</Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </Grid.Col>
                <Grid.Col md={4}>
                    <Card>
                        <Grid>
                            <Grid.Col md={4}>
                                <CalendarIcon date={new Date()} />
                            </Grid.Col>
                            <Grid.Col md={8}>
                                <Text size="sm">
                                    Enregitrer les heures de précense des
                                    enfants
                                </Text>
                            </Grid.Col>
                        </Grid>
                        <Link href={'nurse/calendar'}>
                            <Button
                                variant="light"
                                color="blue"
                                fullWidth
                                style={{ marginTop: 14 }}
                            >
                                Calendrier
                            </Button>
                        </Link>
                    </Card>
                    <Card>
                        <Grid>
                            <Grid.Col md={4}>
                                <AiFillFile />
                            </Grid.Col>
                            <Grid.Col md={8}>
                                <Text size="sm">
                                    Gérez et envoyer des fichiers aux parents
                                </Text>
                            </Grid.Col>
                        </Grid>
                        <Link href={'nurse/file'}>
                            <Button
                                variant="light"
                                color="blue"
                                fullWidth
                                style={{ marginTop: 14 }}
                            >
                                Gestionnaire de fichier
                            </Button>
                        </Link>
                    </Card>
                    <Card>
                        <Grid>
                            <Grid.Col md={4}>
                                <AiFillWechat />
                            </Grid.Col>
                            <Grid.Col md={8}>
                                <Text size="sm">
                                    Echanger des messages avec les parents
                                </Text>
                            </Grid.Col>
                        </Grid>
                        <Link href={'nurse/chat'}>
                            <Button
                                variant="light"
                                color="blue"
                                fullWidth
                                style={{ marginTop: 14 }}
                            >
                                Chat
                            </Button>
                        </Link>
                    </Card>
                </Grid.Col>
            </Grid>
        </>
    );
}

export async function getServerSideProps(ctx) {
    const sessionCallBack = await getSession(ctx);

    const authToken = new AuthToken(sessionCallBack.user.access_token);

    const res = await fetch(
        process.env.BASE_URL + `kid/nurse/${authToken.decodedToken.id}`,
        {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                Authorization: authToken.authorizationString,
            },
        }
    );
    const kids = await res.json();

    const res1 = await fetch(
        process.env.BASE_URL + `link_code/${authToken.decodedToken.id}`,
        {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                Authorization: authToken.authorizationString,
            },
        }
    );
    const code = await res1.json();

    return {
        props: {
            userId: sessionCallBack.user.id,
            bearer: authToken.authorizationString,
            kids,
            code: code.code,
        },
    };
}
