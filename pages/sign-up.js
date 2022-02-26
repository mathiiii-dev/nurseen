import {
    Button,
    Container,
    Grid,
    Space,
    Title,
    MediaQuery,
    Burger, Group, Header, Navbar, createStyles, SimpleGrid, TextInput, Checkbox, Select, Alert
} from "@mantine/core";
import {useState} from "react";
import {useForm} from "@mantine/hooks";
import {event} from "next/dist/build/output/log";

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
    const [errorMessage, setErrorMessage] = useState('');
    const [error, setError] = useState(false);

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
            roles: ''
        },

        validationRules: {
            email: (value) => /^\S+@\S+$/.test(value),
            password: (password) => password.trim().length >= 8
        },

        errorMessages: {
            email: 'Email invalide',
            password: 'Mot de passe trop court. Minimum 8 charactères'
        }
    });

    const signUpUser = () => {
        const res =  fetch(
            'http://localhost:8010/proxy/api/user',
            {
                method: 'POST',
                body: JSON.stringify({
                        email: form.values.email,
                        password: form.values.password,
                        roles: [form.values.roles]
                    }
                ),
                headers: {
                    'Content-type': 'application/json'
                }
            }
        ).then(
            res => {
                if (res.status !== 201) {
                    setError(true)
                    setErrorMessage('Une erreur est survenue pendant l\'envoie du formulaire. Veuillez contacter un administrateur.')
                } else {
                    
                }
            }
        )

    }

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
                <Grid.Col md={12} style={{padding: 100}}>
                    {
                        error ?
                            <Alert title="Erreur!" color="red" withCloseButton closeButtonLabel="Close alert">
                                {errorMessage}
                            </Alert> : ''
                    }

                    <Space h={"xl"}/>
                    <form onSubmit={form.onSubmit(signUpUser)}>
                        <TextInput
                            required
                            label="Email"
                            placeholder="your@email.com"
                            {...form.getInputProps('email')}
                            size={"xl"}
                        />
                        <Space h={"xl"}/>
                        <TextInput
                            required
                            label="Mot de passe"
                            placeholder="********"
                            {...form.getInputProps('password')}
                            size={"xl"}
                        />
                        <Space h={"xl"}/>
                        <Select
                            label="Vous êtes"
                            placeholder="Choisir"
                            data={[
                                {value: 'nurse', label: 'Nourrice'},
                                {value: 'parent', label: 'Parent'}
                            ]}
                            {...form.getInputProps('roles')}
                            size={"xl"}
                        />
                        <Space h={"xl"}/>
                        <Button type="submit" size={"xl"}
                                style={{backgroundColor: '#4ad4c6', float: 'right'}}>M'inscrire</Button>
                    </form>
                </Grid.Col>
            </Grid>
        </Container>
    )
}
