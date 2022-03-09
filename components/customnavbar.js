import {
    Alert,
    Burger,
    Button,
    createStyles,
    Grid,
    Group,
    Header,
    MediaQuery,
    Navbar,
    Space,
    Title
} from "@mantine/core";
import {useState} from "react";
import Link from 'next/link'
import {destroyCookie, parseCookies} from "nookies";
import {destroy} from "../lib/cookies";
import {AuthToken} from "../services/auth_token";
import {useRouter} from "next/router";

const useStyles = createStyles((theme) => ({
    navbar: {
        [theme.fn.largerThan("sm")]: {
            display: "none"
        }
    },

    links: {
        [theme.fn.smallerThan("sm")]: {
            display: "none"
        }
    }
}));

export default function CustomNavbar() {
    const router = useRouter();
    const {classes} = useStyles();
    const [opened, setOpened] = useState(false);
    const token = parseCookies()['token'];
    let auth = new AuthToken(token);
    const logout = async () => {
        console.log(parseCookies())
        destroyCookie(null, 'token', {
            path: '/',
        })
        destroyCookie(null, 'refresh', {
            path: '/',
        })
        destroyCookie(null, 'email', {
            path: '/',
        })
        destroyCookie(null, 'role', {
            path: '/',
        })
        await router.push('/')
    }
    return (
        <Header height={60} padding="xs" style={{marginBottom: 50}}>
            <MediaQuery largerThan="sm" styles={{display: "none"}}>
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
                    !auth.isValid ?
                        <Grid.Col md={10}>
                            <Group position={"right"}>

                                <Button variant={"subtle"} size={"md"} color={"dark"}>A propos</Button>
                                <Button variant={"subtle"} size={"md"} color={"dark"}>Contact</Button>
                                <Space w="xl"/>
                                <Link href="/sign-up">
                                    <Button color="dark" size="md">Inscription</Button>
                                </Link>
                                <Link href="/sign-in">
                                    <Button color="dark" size="md">Connexion</Button>
                                </Link>

                            </Group>
                        </Grid.Col>
                        :
                        <Grid.Col md={10}>
                            <Group position={"right"}>
                                <Button color="dark" size="md" onClick={logout}>Déconnexion</Button>
                            </Group>
                        </Grid.Col>
                }
            </Grid>{
            !auth.isValid ?
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
                        alignItems: 'center'
                    }}
                    hidden={!opened}
                >
                    <Button variant={"subtle"} size={"xl"} color={"dark"} onClick={() => setOpened((o) => !o)}>A
                        propos</Button>
                    <Button variant={"subtle"} size={"xl"} color={"dark"}
                            onClick={() => setOpened((o) => !o)}>Contact</Button>
                    <Link href="/sign-up">
                        <Button variant={"subtle"} color="dark" size="xl"
                                onClick={() => setOpened((o) => !o)}>Inscription</Button>
                    </Link>
                    <Link href="/sign-in">
                        <Button variant={"subtle"} color="dark" size="xl"
                                onClick={() => setOpened((o) => !o)}>Connexion</Button>
                    </Link>
                </Navbar>
                :
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
                        alignItems: 'center'
                    }}
                    hidden={!opened}
                >
                    <Button variant={"subtle"} color="dark" size="xl"
                            onClick={logout}>Déconnexion</Button>
                </Navbar>
        }
        </Header>
    )
}