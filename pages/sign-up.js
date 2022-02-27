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
        const res = fetch(
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
                    form.reset()
                    notifications.showNotification({
                        title: 'Inscription réussite',
                        message: 'Vous pouvez désormais vous connecter',
                        color: 'green',
                        autoClose: 5000
                    })
                }
            }
        )

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
        </>
    )
}

