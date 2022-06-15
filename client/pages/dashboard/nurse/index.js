import {getSession} from 'next-auth/react';
import {
    Alert,
    Box,
    Button,
    Center,
    Grid,
    Modal,
    Pagination,
    Space,
    Text,
    Title,
    Popover,
    LoadingOverlay,
    ColorInput,
    ActionIcon,
    TextInput
} from '@mantine/core';
import {useEffect, useState} from 'react';
import {AuthToken} from '../../../services/auth_token';
import Link from 'next/link';
import {useRouter} from 'next/router';
import '../../../styles/globals.css';
import DashboardCard from '../../../components/DashboardCard';
import {useNotifications} from '@mantine/notifications';
import VerticalCard from '../../../components/VerticalCard';
import {cards, verticalCards} from '../../../data/cards';
import {usePagination} from '@mantine/hooks';
import '../../../styles/globals.css';
import {AiOutlineBgColors} from 'react-icons/ai';

const randomColor = () =>
    `#${Math.floor(Math.random() * 16777215).toString(16)}`;

export default function Page({bearer, userId, code, firstname, lastname}) {
    const router = useRouter();

    const [archiveOpened, setArchiveOpened] = useState(false);
    const [kidId, setKidId] = useState(false);
    const [popOpen, setPopOpen] = useState(false);
    const [opened, setOpened] = useState(false);
    const [openedColor, setOpenedColor] = useState(false);
    const [kids, setKids] = useState([]);
    const [link, setLink] = useState(code);
    const notifications = useNotifications();
    const [page, onChange] = useState(1);
    const [total, setTotal] = useState(1);
    const pagination = usePagination({total, page, onChange});
    const [visible, setVisible] = useState(false);
    const [color, onColorChange] = useState(randomColor());
    const [selectedkid, setSelectedKid] = useState(randomColor());

    const getKid = (id) => {
        kids.forEach((kid) => {
            if (kid.id === id) {
                setSelectedKid(kid);
            }
        });
    };

    useEffect(() => {
        setVisible(true);
        fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}kid/nurse/${userId}?page=${page}`,
            {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: bearer,
                },
            }
        )
            .then((res) => res.json())
            .then((data) => {
                setKids(data.items);
                setTotal(data.pagination.total_pages);
                setVisible(false);
            });
    }, [page]);

    const activate = (kidId) => {
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}kid/${kidId}/activate`, {
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
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}kid/${kidId}/archive`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: bearer,
            },
        }).then((r) => {
            router.reload();
        });
    };

    const linkParent = () => {
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}link_code/${userId}`, {
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

    const colorKid = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}kid/color/${kidId}`, {
            method: 'POST',
            body: JSON.stringify({
                color,
            }),
            headers: {
                'Content-type': 'application/json',
                Authorization: bearer,
            },
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
                opened={openedColor}
                onClose={() => setOpenedColor(false)}
                title="Ajouter ou modifier la couleur lié à un enfant"
            >
                <form onSubmit={colorKid}>
                    <TextInput
                        disabled
                        value={`${
                            selectedkid.firstname + ' ' + selectedkid.lastname
                        }`}
                    />
                    <Space h={'md'}/>
                    <ColorInput
                        placeholder="Choisissez une couleur"
                        label="Couleur"
                        value={color}
                        onChange={onColorChange}
                        rightSection={
                            <ActionIcon
                                onClick={() => onColorChange(randomColor())}
                            >
                                <AiOutlineBgColors size={16}/>
                            </ActionIcon>
                        }
                    />
                    <Space h={'md'}/>
                    <Button
                        type="submit"
                        style={{backgroundColor: '#4ad4c6', float: 'right'}}
                    >
                        Enregistrer
                    </Button>
                </form>
            </Modal>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="Création d'un code parent nécessaire à l'ajout d'un enfant"
            >
                {code || link ? (
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
                            <Text>{code || link}</Text>
                        </Box>
                        <Text>Cliquez sur le code pour le copier</Text>
                    </>
                ) : (
                    <Button
                        style={{backgroundColor: '#4ad4c6', float: 'right'}}
                        onClick={() => {
                            linkParent();
                        }}
                    >
                        Créer un code
                    </Button>
                )}
            </Modal>
            <Grid>
                <Grid.Col>
                    <Title>{`Bonjour, ${firstname} ${lastname} ! `}</Title>
                </Grid.Col>
                <Grid.Col>
                    <Popover
                        opened={popOpen}
                        onClose={() => setPopOpen(false)}
                        position="right"
                        placement="center"
                        withArrow
                        trapFocus={false}
                        closeOnEscape={false}
                        transition="pop-top-left"
                        width={260}
                        styles={{body: {pointerEvents: 'none'}}}
                        target={
                            <Button
                                onClick={() => setOpened(true)}
                                onMouseEnter={() => setPopOpen(true)}
                                onMouseLeave={() => setPopOpen(false)}
                            >
                                Code de liaison
                            </Button>
                        }
                    >
                        <Text size="sm">
                            Code nécessaire à l'ajout d'un enfant pour les
                            parents
                        </Text>
                    </Popover>
                </Grid.Col>
            </Grid>

            <Space h={'xl'}/>
            <Grid>
                {cards &&
                Object.values(cards).map((card) => {
                    return (
                        <Grid.Col md={3} key={card.id}>
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
                    Êtes-vous sûr de vouloir archiver cette enfant ? <br/>
                    Il n'apparaitra plus dans cette liste
                </Alert>
                <Space h={'xl'}/>
                <Button fullWidth color="red" onClick={() => archived()}>
                    Archiver
                </Button>
            </Modal>
            <Grid gutter="xl">
                <Grid.Col md={8}>
                    <LoadingOverlay visible={visible} overlayOpacity={100}/>
                    {kids.length > 0 ? (
                        <>
                            <table className="table">
                                <thead className="thead">
                                <tr className="tr">
                                    <th scope="col" className="th">
                                        <Text>Nom</Text>
                                    </th>
                                    <th scope="col" className="th">
                                        <Text>Prénom</Text>
                                    </th>
                                    <th scope="col" className="th">
                                        <Text>Activer</Text>
                                    </th>
                                    <th scope="col" className="th">
                                        <Text>Archiver</Text>
                                    </th>
                                    <th scope="col" className="th">
                                        <Text>Note</Text>
                                    </th>
                                    <th scope="col" className="th">
                                        <Text>Couleur</Text>
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="tbody">
                                {kids.map((kid) => {
                                    return (
                                        <tr key={kid.id} className="tr">
                                            <td data-label="Nom" className="td">
                                                <Text>{kid.lastname}</Text>
                                            </td>
                                            <td data-label="Prénom" className="td">
                                                <Text>{kid.firstname}</Text>
                                            </td>
                                            <td data-label="Activer" className="td">
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
                                            <td data-label="Archiver" className="td">
                                                {
                                                    <Button
                                                        color="red"
                                                        onClick={() => {
                                                            setArchiveOpened(
                                                                true
                                                            );
                                                            setKidId(
                                                                kid.id
                                                            );
                                                        }}
                                                    >
                                                        Archiver
                                                    </Button>
                                                }
                                            </td>
                                            <td data-label="Note" className="td">
                                                <Link
                                                    href={{
                                                        pathname: `/dashboard/nurse/kid/[pid]/notes`,
                                                        query: {
                                                            pid: kid.id,
                                                        },
                                                    }}
                                                >
                                                    <Button>Note</Button>
                                                </Link>
                                            </td>
                                            <td data-label="Couleur" className="td">
                                                {
                                                    <Button
                                                        onClick={() => {
                                                            getKid(kid.id);
                                                            onColorChange(
                                                                kid.color ??
                                                                randomColor()
                                                            );
                                                            setOpenedColor(
                                                                true
                                                            );
                                                            setKidId(
                                                                kid.id
                                                            );
                                                        }}
                                                    >
                                                        Couleur
                                                    </Button>
                                                }
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                            <Center>
                                <Pagination total={total} onChange={onChange}/>
                            </Center>
                        </>
                    ) : (
                        <Text>
                            Aucun enfant n'est relié à vous, dès qu'un enfant le
                            sera, il apparaîtra ici.
                        </Text>
                    )}
                </Grid.Col>
                <Grid.Col md={4}>
                    {verticalCards &&
                    Object.values(verticalCards).map((card) => {
                        return (
                            <VerticalCard
                                text={card.text}
                                link={card.linkHref}
                                button={card.button}
                                key={card.id}
                            >
                                {card.children}
                            </VerticalCard>
                        );
                    })}
                </Grid.Col>
            </Grid>
        </>
    );
}

export async function getServerSideProps(ctx) {
    const sessionCallBack = await getSession(ctx);

    const authToken = new AuthToken(sessionCallBack.user.access_token);

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}link_code/${authToken.decodedToken.id}`,
        {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                Authorization: authToken.authorizationString,
            },
        }
    );
    const code = await res.json();

    return {
        props: {
            userId: sessionCallBack.user.id,
            bearer: authToken.authorizationString,
            code: code.code,
            lastname: authToken.decodedToken.lastname,
            firstname: authToken.decodedToken.firstname,
        },
    };
}
