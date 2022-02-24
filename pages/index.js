import {
    Button,
    Center,
    Container,
    Grid,
    Image,
    Space,
    Text,
    Title,
    MediaQuery,
    Burger, Group, Header, Navbar, createStyles, SimpleGrid
} from "@mantine/core";
import {useState} from "react";

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

export default function Home() {
    const {classes} = useStyles();
    const [opened, setOpened] = useState(false);
    return (
        <Container size={1280} padding={11}>
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
                        <Title>Nurseen</Title>
                    </Grid.Col>
                    <Grid.Col md={10}>
                        <Group position={"right"}>
                            <Button variant={"subtle"} size={"md"} color={"dark"}>A propos</Button>
                            <Button variant={"subtle"} size={"md"} color={"dark"}>Contact</Button>
                            <Space w="xl"/>
                            <Button color="dark" size="md">Inscription</Button>
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
                    <Button variant={"subtle"} color="dark" size="xl">Inscription</Button>
                    <Button variant={"subtle"} color="dark" size="xl">Connexion</Button>
                </Navbar>
            </Header>
            <Grid style={{backgroundColor: '#f4fdfc', padding: 50, borderRadius: 11}}>
                <Grid.Col md={6}>
                    <Center>
                        <Title style={{fontSize: 80}}>
                            Nurseen
                        </Title>
                    </Center>
                    <Space h={"xl"}/>
                    <Text size={"xl"} style={{paddingLeft: 45, paddingRight: 45}} align={"left"}>
                        Nous aidons les nourrices dans leur travail au quotidien. Et nous permettons aux parents de
                        suivre la croissance de leur(s) enfant(s)
                    </Text>
                    <Space h={"xl"}/>
                    <Center>
                        <Button style={{marginTop: 25, backgroundColor: '#4ad4c6'}} radius={"xl"} size={"xl"}>
                            Essayer
                        </Button>
                    </Center>
                </Grid.Col>
                <Grid.Col md={6}>
                    <Image
                        radius="md"
                        src="/img/undraw_motherhood_re_pk2m.svg"
                        alt="Random unsplash image"
                    />
                </Grid.Col>
            </Grid>
            <Grid style={{marginTop: 200, marginBottom: 200}}>
                <Grid.Col md={6}>
                    <Title>Nourrice</Title>
                    <SimpleGrid cols={2} spacing="xl" style={{marginTop: 50}}>
                        <div>
                            <Title order={2}>01.</Title>
                            <Title order={3}>Emploie du temps des enfants</Title>
                        </div>
                        <div>
                            <Title order={2}>02. </Title>
                            <Title order={3}>Répertorier les activités effectué</Title>
                        </div>
                        <div>
                            <Title order={2}>03.</Title>
                            <Title order={3}>Enregistrement du menu de midi</Title>
                        </div>
                        <div>
                            <Title order={2}>04.</Title>
                            <Title order={3}>Note personnel au parent</Title>
                        </div>
                    </SimpleGrid>
                </Grid.Col>
                <Grid.Col md={6}>
                    <Center>
                        <Image
                            radius="md"
                            src="/img/undraw_baby_ja-7-a.svg"
                            alt="Random unsplash image"
                        />
                    </Center>
                </Grid.Col>
            </Grid>
            <Grid style={{backgroundColor: '#f4fdfc', padding: 100}}>
                <Grid.Col md={12}>
                    <Center>
                        <Image
                            radius="md"
                            src="/img/undraw_playful_cat_re_ac9g.svg"
                            alt="Random unsplash image"
                        />
                    </Center>
                </Grid.Col>
            </Grid>
            <Grid style={{marginTop: 200, marginBottom: 200}}>
                <Grid.Col md={6}>
                    <Center>
                        <Image
                            radius="md"
                            src="/img/undraw_true_friends_c-94-g.svg"
                            alt="Random unsplash image"
                        />
                    </Center>
                </Grid.Col>
                <Grid.Col md={6}>
                    <Title>Parent</Title>
                    <SimpleGrid cols={2} spacing="xl" style={{marginTop: 50}}>
                        <div>
                            <Title order={2}>01.</Title>
                            <Title order={3}>Modifié les heures de précense d'un enfant</Title>
                        </div>
                        <div>
                            <Title order={2}>02. </Title>
                            <Title order={3}>Voir les activités effectuées</Title>
                        </div>
                        <div>
                            <Title order={2}>03.</Title>
                            <Title order={3}>Envoyer un message à la nourrice</Title>
                        </div>
                        <div>
                            <Title order={2}>04.</Title>
                            <Title order={3}>Organiser vos factures </Title>
                        </div>
                    </SimpleGrid>
                </Grid.Col>
            </Grid>
        </Container>
    )
}
