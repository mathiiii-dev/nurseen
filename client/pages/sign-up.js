import {
    Button,
    Grid,
    Space,
    Title,
    TextInput,
    Select,
    Alert,
    PasswordInput
} from "@mantine/core";
import {useState} from "react";
import {useForm} from "@mantine/hooks";
import { AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";
import { useNotifications } from '@mantine/notifications';
import {signIn} from "next-auth/react";

export default function SignUp() {
    const notifications = useNotifications();
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
            password: (password) => password.trim().length >= 8,
            roles: (roles) => roles !== ''
        },

        errorMessages: {
            email: 'Email invalide',
            password: 'Mot de passe trop court. Minimum 8 charactères',
            roles: 'Vous devez sélectionner un role'
        }
    });

    const signUpUser = () => {
        fetch(
            process.env.BASE_URL + 'user',
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
            async res => {
                if (res.status !== 201) {
                    const resp = await res.json()
                    setError(true)
                    setErrorMessage(resp.error_description ?? 'Une erreur est survenue pendant l\'envoie du formulaire. Veuillez contacter un administrateur.')
                } else {
                    form.reset()
                    notifications.showNotification({
                        title: 'Inscription réussite',
                        message: 'Vous allez être redirigé vers la page de connexion',
                        color: 'green',
                        autoClose: 3000
                    })
                    setTimeout(endOfSubmit, 4000)
                }
            }
        );
    }

    const endOfSubmit = () => {
        signIn()
    }

    return (
        <>
            <Grid style={{backgroundColor: '#f4fdfc', borderRadius: 11, padding: 25}}>
                <Grid.Col md={12} style={{padding: 25}}>
                    <Title>Création de compte</Title>
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
                    <form onSubmit={form.onSubmit(signUpUser)}>
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
                            visibilityToggleIcon={({ reveal, size }) =>
                                reveal ? <AiOutlineEyeInvisible size={size} /> : <AiOutlineEye size={size} />
                            }
                            {...form.getInputProps('password')}
                            size={"xl"}
                        />
                        <Space h={"xl"}/>
                        <Select
                            required
                            label="Vous êtes"
                            placeholder="Choisir"
                            data={[
                                {value: 'ROLE_NURSE', label: 'Nourrice'},
                                {value: 'ROLE_PARENT', label: 'Parent'}
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
        </>
    )
}

