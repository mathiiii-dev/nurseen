import {
    Burger,
    Button,
    createStyles,
    Grid,
    Group,
    Header,
    MediaQuery,
    Navbar,
    Space,
    Title,
} from '@mantine/core';
import { useState } from 'react';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';

const useStyles = createStyles((theme) => ({
    navbar: {
        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },

    links: {
        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },
}));

export default function CustomNavbar() {
    const { data: session, status } = useSession();
    let dashboard = '/';

    if (session) {
        const role = session.user.role;
        dashboard = 'dashboard/nurse';
        if (role === 'ROLE_PARENT') {
            dashboard = 'dashboard/family';
        }
    }

    const { classes } = useStyles();
    const [opened, setOpened] = useState(false);

    return (
        <Header height={60} padding="xs" style={{ marginBottom: 50 }}>
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                <Burger
                    opened={opened}
                    onClick={() => setOpened((o) => !o)}
                    size="sm"
                    mr="xl"
                />
            </MediaQuery>
            <Grid className={classes.links}>
                <Grid.Col md={2}>
                    <Link href="/">
                        <Title>Nurseen</Title>
                    </Link>
                </Grid.Col>
                {
                    <Grid.Col md={10}>
                        <Group position={'right'}>
                            <Space w="xl" />
                            {status === 'unauthenticated' ? (
                                <>
                                    <Link href="/sign-up">
                                        <Button color="dark" size="md">
                                            Inscription
                                        </Button>
                                    </Link>
                                    <Button
                                        color="dark"
                                        size="md"
                                        onClick={() => signIn()}
                                    >
                                        Connexion
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link href={'/' + dashboard}>
                                        <Button
                                            variant={'subtle'}
                                            color="dark"
                                            size="md"
                                        >
                                            Dashboard
                                        </Button>
                                    </Link>
                                    <Button
                                        color="dark"
                                        size="md"
                                        onClick={() =>
                                            signOut({ callbackUrl: '/' })
                                        }
                                    >
                                        Sign out
                                    </Button>
                                </>
                            )}
                        </Group>
                    </Grid.Col>
                }
            </Grid>
            {
                <Navbar
                    className={classes.navbar}
                    style={{
                        backgroundColor: '#f4fdfc',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        marginTop: 70,
                        flexDirection: 'column',
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    hidden={!opened}
                >
                    <Button
                        variant={'subtle'}
                        size={'xl'}
                        color={'dark'}
                        onClick={() => setOpened((o) => !o)}
                    >
                        A propos
                    </Button>
                    <Button
                        variant={'subtle'}
                        size={'xl'}
                        color={'dark'}
                        onClick={() => setOpened((o) => !o)}
                    >
                        Contact
                    </Button>
                    {status === 'unauthenticated' ? (
                        <>
                            <Link href="/sign-up">
                                <Button color="dark" size="md">
                                    Inscription
                                </Button>
                            </Link>
                            <Button
                                color="dark"
                                size="md"
                                onClick={() => {
                                    signIn();
                                    setOpened((o) => !o);
                                }}
                            >
                                Connexion
                            </Button>
                        </>
                    ) : (
                        <Button
                            color="dark"
                            size="md"
                            onClick={() => {
                                signOut({ callbackUrl: '/' });
                                setOpened((o) => !o);
                            }}
                        >
                            Sign out
                        </Button>
                    )}
                </Navbar>
            }
        </Header>
    );
}
