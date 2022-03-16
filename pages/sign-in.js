import {
    Button,
    Grid,
    Space,
    Title,
    TextInput,
    Alert,
    PasswordInput
} from "@mantine/core";
import {useState} from "react";
import {useForm} from "@mantine/hooks";
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";
import { setCookies } from "../lib/cookies";
import { useRouter } from 'next/router';
import jwtDecode from "jwt-decode";

export default function SignIn() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState('');
    const [error, setError] = useState(false);

    const form = useForm({
        initialValues: {
            email: '',
            password: ''
        },

        validationRules: {
            email: (value) => /^\S+@\S+$/.test(value),
            password: (password) => password !== ''
        },

        errorMessages: {
            email: 'Email invalide',
            password: 'Veuillez saisir un mot de passe'
        }
    });

    const login = async (event) => {
        event.preventDefault()
        await fetch(
            'http://localhost:8010/proxy/api/login_check',
            {
                method: 'POST',
                body: JSON.stringify({
                    email: form.values.email,
                    password: form.values.password
                }),
                headers: {
                    'Content-type': 'application/json'
                }
            }
        )
            .then(response => response.json())
            .then(response => {
                if (response.code && response.code !== 200) {
                    setError(true)
                    let message = response.message ?? 'Une erreur est survenue pendant l\'envoie du formulaire. Veuillez contacter un administrateur.'
                    setErrorMessage(message)
                } else {
                    const decoded = jwtDecode(response.token);
                    setCookies('token', response.token);
                    setCookies('refresh', response.refresh_token);
                    setCookies('email', decoded.email);
                    setCookies('role', decoded.roles[0]);
                    const role = decoded.roles[0];
                    if(role === 'ROLE_NURSE') {
                        router.push(`/dashboard/nurse/${decoded.id}`);
                    } else if(role === 'ROLE_PARENT') {
                        router.push(`/dashboard/family/${decoded.id}`);
                    }
                }
            })
    }

    return (
        <>
            <Grid style={{backgroundColor: '#f4fdfc', borderRadius: 11, padding: 25}}>
                <Grid.Col md={12} style={{padding: 25}}>
                    <Title>Connexion</Title>
                    {
                        error ?
                            <Alert title="Erreur!" color="red" withCloseButton closeButtonLabel="Close alert"
                                   onClose={() => {
                                       setError(false)
                                   }}>
                                {errorMessage}
                            </Alert> : ''
                    }
                    <Space h={"xl"}/>
                    <form onSubmit={login}>
                        <TextInput
                            required
                            label="Email"
                            placeholder="your@email.com"
                            {...form.getInputProps('email')}
                            size={"xl"}
                        />
                        <Space h={"xl"}/>
                        <PasswordInput
                            required
                            label="Mot de passe"
                            placeholder="********"
                            visibilityToggleIcon={({reveal, size}) =>
                                reveal ? <AiOutlineEyeInvisible size={size}/> : <AiOutlineEye size={size}/>
                            }
                            {...form.getInputProps('password')}
                            size={"xl"}
                        />
                        <Space h={"xl"}/>
                        <Button type="submit" size={"xl"}
                                style={{backgroundColor: '#4ad4c6', float: 'right'}}>Me connecter</Button>
                    </form>
                </Grid.Col>
            </Grid>
        </>
    )
}

