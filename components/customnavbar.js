import {Burger, Button, createStyles, Grid, Group, Header, MediaQuery, Navbar, Space, Title} from "@mantine/core";
import {useState} from "react";
import Link from 'next/link'

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
    const {classes} = useStyles();
    const [opened, setOpened] = useState(false);
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
                <Grid.Col md={10}>
                    <Group position={"right"}>
                        <Button variant={"subtle"} size={"md"} color={"dark"}>A propos</Button>
                        <Button variant={"subtle"} size={"md"} color={"dark"}>Contact</Button>
                        <Space w="xl"/>
                        <Link href="/sign-up">
                            <Button color="dark" size="md">Inscription</Button>
                        </Link>
                        <Button color="dark" size="md">Connexion</Button>
                    </Group>
                </Grid.Col>
            </Grid>
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
                <Button variant={"subtle"} size={"xl"} color={"dark"}>A propos</Button>
                <Button variant={"subtle"} size={"xl"} color={"dark"}>Contact</Button>
                <Link href="/sign-up">
                    <Button variant={"subtle"} color="dark" size="xl">Inscription</Button>
                </Link>
                <Button variant={"subtle"} color="dark" size="xl">Connexion</Button>
            </Navbar>
        </Header>
    )
}